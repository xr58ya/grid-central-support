// POST /api/tickets and GET /api/config, run in Node against stand-ins for D1, R2, Turnstile and Resend.

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/tickets.js';
import { onRequestGet as config } from '../functions/api/config.js';
import { onRequest as siteMiddleware } from '../functions/_middleware.js';
import { createTicket, sendLimit, senderKey } from '../lib/tickets.js';
import { MIGRATION, baseEnv, bugAnswers, context, installFetch, makeD1, ticketRequest, PNG } from './helpers.mjs';

const net = {};
beforeEach(function () { net.resendDown = false; installFetch(net); });

async function post(env, opts) {
  const ctx = context(ticketRequest(opts), env);
  const res = await onRequestPost(ctx);
  await ctx.settle();
  return { res: res, body: await res.json() };
}

function rows(env, sql) {
  return env.DB.sqlite.prepare(sql).all().map(function (r) { return Object.assign({}, r); });
}

test('a bug report with files is stored as GC-1001, files go to R2, and both emails are sent', async function () {
  const env = baseEnv();
  const log = new TextEncoder().encode('10:00 INFO hello\n10:01 ERROR spotter crashed\n');
  const { res, body } = await post(env, { files: [{ name: 'companion.log', bytes: log }, { name: 'My Shot.png', bytes: PNG }] });
  assert.equal(res.status, 201, JSON.stringify(body));
  assert.deepEqual(body, { ok: true, ticket: 'GC-1001', files: 2, warnings: [] });

  const t = rows(env, 'SELECT * FROM tickets')[0];
  assert.equal(t.id, 1001);
  assert.equal(t.type, 'bug');
  assert.equal(t.status, 'new');
  assert.equal(t.version, '0.5.9.2');
  assert.equal(t.email, 'driver@example.com');
  assert.deepEqual(JSON.parse(t.areas), ['Engineer, strategy or coach', 'Talkback / voice / commentary']);
  assert.equal(JSON.parse(t.answers).steps, '1. Join a race\n2. Pit\n3. Rejoin');

  const files = rows(env, 'SELECT * FROM ticket_files ORDER BY filename');
  assert.deepEqual(files.map(function (f) { return [f.filename, f.kind, f.content_type]; }),
    [['My_Shot.png', 'image', 'image/png'], ['companion.log', 'log', 'text/plain; charset=utf-8']]);
  assert.equal(env.FILES.store.size, 2);
  for (const f of files) {
    assert.match(f.r2_key, /^tickets\/GC-1001\/[0-9a-f]{32}\//);
    assert.ok(env.FILES.store.has(f.r2_key));
  }

  assert.equal(net.emails.length, 2);
  const ack = net.emails.find(function (e) { return e.body.to[0] === 'driver@example.com'; }).body;
  const owner = net.emails.find(function (e) { return e.body.to[0] === 'owner-inbox@example.com'; }).body;
  assert.equal(ack.from, 'Grid Central Support <support@gridcentral.store>');
  assert.equal(ack.reply_to, 'support@gridcentral.store');
  assert.match(ack.subject, /^\[GC-1001\]/);
  assert.match(ack.text, /GC-1001/);
  assert.doesNotMatch(ack.text + ack.subject, /Spotter stops/, 'the confirmation repeats none of the sender\'s words');
  assert.match(owner.subject, /^\[GC-1001\] New bug report: Spotter stops calling cars after pitting \(0\.5\.9\.2\)$/);
  assert.match(owner.text, /From: driver@example.com/);
  assert.match(owner.text, /Steps to reproduce:\n1\. Join a race/);
  assert.match(owner.text, /companion\.log \(1 KB\)/);
  assert.match(owner.text, /^Answer in the admin: https:\/\/support\.gridcentral\.store\/admin\/#\/GC-1001\n\(Replying to this email doesn't reach the customer\.\)/);
  assert.equal(owner.reply_to, undefined);
  for (const e of net.emails) {
    assert.equal(e.headers['User-Agent'], 'grid-central-support/1.0', 'Resend refuses requests without one');
    assert.equal(e.headers['Idempotency-Key'], undefined, 'nothing retries, and a reused ticket number would reuse the key');
  }

  const events = rows(env, 'SELECT kind, actor, meta FROM ticket_events ORDER BY id');
  assert.deepEqual(events.map(function (e) { return e.kind; }), ['created', 'email', 'email']);
  assert.ok(events.slice(1).every(function (e) { return JSON.parse(e.meta).ok === true; }));

  const second = await post(env, { email: 'other@example.com' });
  assert.equal(second.body.ticket, 'GC-1002');
});

test('a failed email never loses the ticket: it is stored and the failure is in its history', async function () {
  const env = baseEnv();
  net.resendDown = true;
  const { res, body } = await post(env, {});
  assert.equal(res.status, 201);
  assert.equal(body.ticket, 'GC-1001');
  const ev = rows(env, 'SELECT meta FROM ticket_events WHERE kind = \'email\'').map(function (e) { return JSON.parse(e.meta); });
  assert.equal(ev.length, 2);
  assert.ok(ev.every(function (m) { return m.ok === false && /500/.test(m.error); }));
});

test('no Resend key or owner address: the ticket is still stored and the history says why', async function () {
  const env = baseEnv({ RESEND_API_KEY: undefined, OWNER_EMAIL: undefined });
  const { res } = await post(env, {});
  assert.equal(res.status, 201);
  const ev = rows(env, 'SELECT meta FROM ticket_events WHERE kind = \'email\'').map(function (e) { return JSON.parse(e.meta); });
  assert.match(ev[0].error, /RESEND_API_KEY/);
  assert.match(ev[1].error, /OWNER_EMAIL/);
  assert.equal(net.emails.length, 0);
});

test('a file whose database row can\'t be written isn\'t left in storage', async function () {
  const env = baseEnv();
  const prepare = env.DB.prepare;
  env.DB.prepare = function (sql) {
    if (/^INSERT INTO ticket_files/.test(sql)) return { bind: function () { return { run: async function () { throw new Error('D1 is busy'); } }; } };
    return prepare(sql);
  };
  const { res, body } = await post(env, { files: [{ name: 'companion.log', bytes: new TextEncoder().encode('log') }] });
  assert.equal(res.status, 201);
  assert.match(body.warnings[0], /companion\.log couldn't be saved/);
  assert.equal(env.FILES.store.size, 0);
});

test('a failed file upload keeps the ticket and warns the sender', async function () {
  const env = baseEnv();
  env.FILES.failPuts = true;
  const { res, body } = await post(env, { files: [{ name: 'shot.png', bytes: PNG }] });
  assert.equal(res.status, 201);
  assert.equal(body.files, 0);
  assert.equal(body.warnings.length, 1);
  assert.match(body.warnings[0], /shot\.png couldn't be saved/);
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM ticket_files')[0].n, 0);
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM ticket_events WHERE kind = \'file\'')[0].n, 1);
});

test('the Turnstile check must pass, and nothing is stored when it fails', async function () {
  const env = baseEnv();
  // Things the sender can fix by doing the check again.
  for (const token of ['bad-token', '', 'used-token']) {
    const r = await post(env, { token: token });
    assert.equal(r.res.status, 403, token);
    assert.equal(r.body.retryCheck, true, token);
  }
  // Things they can't: a check done on another site, a wrong secret, Turnstile not answering.
  const cases = [['other-site-token', env], ['good-token', baseEnv({ TURNSTILE_SECRET: 'pasted-wrong' })]];
  for (const [token, e] of cases) {
    const r = await post(e, { token: token });
    assert.equal(r.res.status, 503, token);
    assert.equal(r.body.retryCheck, undefined, token);
    assert.match(r.body.error, /couldn't be confirmed/);
    assert.equal(r.body.fields, undefined, 'so the form offers Copy my answers and email');
  }
  net.turnstileDown = true;
  assert.equal((await post(env, {})).res.status, 503);
  net.turnstileDown = false;
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM tickets')[0].n, 0);
  assert.equal(net.emails.length, 0);
  // On localhost (wrangler dev with Turnstile's test keys) the site the check was done on doesn't matter.
  assert.equal((await post(env, { token: 'other-site-token', site: 'http://localhost:8788' })).res.status, 201);
});

test('email links always point at support.gridcentral.store, and OWNER_EMAIL can list several addresses', async function () {
  const env = baseEnv({ OWNER_EMAIL: 'support.gridcentral@gmail.com, me@example.com' });
  const { res } = await post(env, { site: 'https://abc123.grid-central-support.pages.dev' });
  assert.equal(res.status, 201);
  const owner = net.emails.find(function (e) { return e.body.to.length === 2; });
  assert.ok(owner, 'one owner email to both addresses');
  assert.deepEqual(owner.body.to, ['support.gridcentral@gmail.com', 'me@example.com']);
  assert.match(owner.body.text, /https:\/\/support\.gridcentral\.store\/admin\/#\/GC-1001/);
  assert.doesNotMatch(owner.body.text + JSON.stringify(net.emails), /pages\.dev/);
});

test('only support.gridcentral.store (and localhost) serves the site: pages.dev addresses forward, their API is closed', async function () {
  const run = async function (url) { return siteMiddleware(context(new Request(url), baseEnv())); };
  let res = await run('https://grid-central-support.pages.dev/report.html?type=bug');
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('Location'), 'https://support.gridcentral.store/report.html?type=bug');
  res = await run('https://abc123.grid-central-support.pages.dev/admin/');
  assert.equal(res.headers.get('Location'), 'https://support.gridcentral.store/admin/');
  for (const u of ['https://grid-central-support.pages.dev/api/tickets', 'https://abc123.grid-central-support.pages.dev/api/config', 'https://grid-central-support.pages.dev/api']) {
    res = await run(u);
    assert.equal(res.status, 404, u);
  }
  for (const u of ['https://support.gridcentral.store/api/tickets', 'http://localhost:8788/report.html', 'http://127.0.0.1:8788/api/config']) {
    assert.equal(await (await run(u)).text(), 'next', u);
  }
});

test('a whole companion.log pasted into the form says which box to change', async function () {
  const env = baseEnv();
  let r = await post(env, { answers: bugAnswers({ logs: 'x'.repeat(30000) }) });
  assert.equal(r.res.status, 400);
  assert.match(r.body.fields.logs, /20000/);
  r = await post(env, { answers: bugAnswers({ logs: '10:00 ERROR C:\\Users\\me "quoted"\n'.repeat(4000) }) });
  assert.equal(r.res.status, 400);
  assert.match(r.body.fields.logs, /attach companion\.log as a file/);
  assert.match(r.body.error, /attach it as a file/);
});

test('a big upload without a Content-Length is cut off at the size limit', async function () {
  const env = baseEnv();
  const chunk = new Uint8Array(1024 * 1024);
  let sent = 0;
  const body = new ReadableStream({
    pull: function (controller) {
      if (sent >= 30) { controller.close(); return; }
      sent++;
      controller.enqueue(chunk);
    }
  });
  const request = new Request('https://support.gridcentral.store/api/tickets', {
    method: 'POST', body: body, duplex: 'half', headers: { 'Content-Type': 'multipart/form-data; boundary=x' }
  });
  assert.equal(request.headers.get('Content-Length'), null);
  const res = await onRequestPost(context(request, env));
  assert.equal(res.status, 413);
  assert.ok(sent < 30, 'stopped reading early');
  assert.equal(net.turnstileCalls, 0);
});

test('answers are checked before Turnstile is asked, and errors come back per field', async function () {
  const env = baseEnv();
  const { res, body } = await post(env, { answers: bugAnswers({ steps: '', frequency: 'Always' }), email: 'nope' });
  assert.equal(res.status, 400);
  assert.ok(body.fields.steps && body.fields.frequency && body.fields.email);
  assert.equal(net.turnstileCalls, 0);
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM tickets')[0].n, 0);
});

test('wrong or disguised file types are refused before anything is stored', async function () {
  const env = baseEnv();
  let r = await post(env, { files: [{ name: 'tool.exe', bytes: new Uint8Array([0x4d, 0x5a, 0, 0]) }] });
  assert.equal(r.res.status, 400);
  assert.ok(r.body.fields.files);
  r = await post(env, { files: [{ name: 'shot.png', bytes: new TextEncoder().encode('<script>alert(1)</script>') }] });
  assert.equal(r.res.status, 400);
  r = await post(env, { files: new Array(6).fill({ name: 'a.png', bytes: PNG }) });
  assert.equal(r.res.status, 400);
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM tickets')[0].n, 0);
  assert.equal(env.FILES.store.size, 0);
});

test('one address can send 5 tickets an hour', async function () {
  const env = baseEnv();
  for (let i = 0; i < 5; i++) assert.equal((await post(env, {})).res.status, 201);
  const r = await post(env, {});
  assert.equal(r.res.status, 429);
  assert.equal((await post(env, { email: 'someone-else@example.com' })).res.status, 201);
});

test('the same mailbox written differently counts as one sender', async function () {
  // Made-up addresses; no email is really sent in the tests.
  assert.equal(senderKey('GC.Limit.Test+x@GoogleMail.com'), 'gclimittest@gmail.com');
  assert.equal(senderKey('First.Last+x@Example.com'), 'first.last@example.com', 'dots only matter at Gmail');
  const env = baseEnv();
  const variants = ['gc.limit.test@gmail.com', 'GC.LIMIT.TEST@gmail.com', 'gc.limit.test+1@gmail.com', 'gclimittest@gmail.com',
    'g.c.limit.test+2@googlemail.com', 'gc.limit.test@GMAIL.com'];
  const statuses = [];
  for (const email of variants) statuses.push((await post(env, { email: email })).res.status);
  assert.deepEqual(statuses, [201, 201, 201, 201, 201, 429]);
});

test('tickets sent at the same moment from one address can\'t get past the limit', async function () {
  const env = baseEnv();
  const results = await Promise.all(new Array(9).fill(0).map(function () { return post(env, {}); }));
  const accepted = results.filter(function (r) { return r.res.status === 201; });
  assert.equal(accepted.length, 5, results.map(function (r) { return r.res.status; }).join(' '));
  assert.ok(results.every(function (r) { return r.res.status === 201 || r.res.status === 429; }));
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM tickets')[0].n, 5);
  assert.equal(net.emails.length, 10, 'emails only for the stored tickets');
});

test('the daily cap keeps Resend\'s 100 emails a day for replies too', async function () {
  const db = makeD1();
  const noon = Date.parse('2026-10-16T12:00:00Z');
  const insert = db.sqlite.prepare("INSERT INTO tickets (id, type, summary, email, created_at, updated_at) VALUES (?, 'bug', 's', ?, ?, ?)");
  // Yesterday doesn't count; this morning, spread out so no hour is full.
  for (let i = 0; i < 10; i++) insert.run(2000 + i, 'old' + i + '@example.com', '2026-10-15T20:00:00.000Z', '2026-10-15T20:00:00.000Z');
  for (let i = 0; i < 34; i++) {
    const at = new Date(Date.parse('2026-10-16T00:10:00Z') + i * 15 * 60 * 1000).toISOString();
    insert.run(3000 + i, 'd' + i + '@example.com', at, at);
  }
  assert.equal(await sendLimit(db, 'new@example.com', { now: noon }), null, 'the 35th of the day is fine');
  insert.run(4000, 'd34@example.com', '2026-10-16T11:30:00.000Z', '2026-10-16T11:30:00.000Z');
  assert.equal(await sendLimit(db, 'new@example.com', { now: noon }), 'day');
  assert.equal(await sendLimit(db, 'new@example.com', { now: Date.parse('2026-10-17T00:05:00Z') }), null, 'a new day starts at midnight UTC, like Resend\'s');
});

test('a counter set back below an existing ticket skips past it instead of stopping the form', async function () {
  const db = makeD1();
  const v = { type: 'bug', summary: 's', email: 'a@b.co', version: null, areas: [], answers: {} };
  assert.equal(await createTicket(db, v), 1001);
  assert.equal(await createTicket(db, v), 1002);
  db.sqlite.exec('DELETE FROM ticket_events WHERE ticket_id = 1001; DELETE FROM tickets WHERE id = 1001');
  db.sqlite.exec("UPDATE counters SET value = 1000 WHERE name = 'ticket'");
  assert.equal(await createTicket(db, v), 1003);
  assert.equal(await createTicket(db, v), 1004);
  // The guide's reset: back to the highest ticket left (or 1000 when there are none).
  db.sqlite.exec("UPDATE counters SET value = (SELECT COALESCE(MAX(id), 1000) FROM tickets) WHERE name = 'ticket'");
  assert.equal(await createTicket(db, v), 1005);
});

test('requests that aren\'t the form are refused', async function () {
  const env = baseEnv();
  const json = new Request('https://support.gridcentral.store/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal((await onRequestPost(context(json, env))).status, 415);
  const fd = new FormData();
  fd.append('payload', 'not json');
  const bad = new Request('https://support.gridcentral.store/api/tickets', { method: 'POST', body: fd });
  assert.equal((await onRequestPost(context(bad, env))).status, 400);
  const huge = new Request('https://support.gridcentral.store/api/tickets', { method: 'POST', body: fd, headers: { 'Content-Length': String(40 * 1024 * 1024) } });
  assert.equal((await onRequestPost(context(huge, env))).status, 413);
});

test('until Turnstile and the database are set up, the form is told to use email instead', async function () {
  const off = baseEnv({ TURNSTILE_SECRET: undefined });
  const r = await post(off, {});
  assert.equal(r.res.status, 503);
  assert.match(r.body.error, /support\.gridcentral@gmail\.com/);
  const c = await (await config(context(new Request('https://x/api/config'), off))).json();
  assert.equal(c.sending, false);
  assert.equal(c.turnstileSiteKey, null);
  const on = await (await config(context(new Request('https://x/api/config'), baseEnv()))).json();
  assert.equal(on.sending, true);
  assert.equal(on.turnstileSiteKey, 'test-site-key');
  assert.equal(on.files.maxFiles, 5);
});

test('the database setup can be run twice without harm', function () {
  const db = makeD1();
  db.sqlite.exec("UPDATE counters SET value = 1500 WHERE name = 'ticket'");
  db.sqlite.exec(MIGRATION);
  assert.equal(db.sqlite.prepare("SELECT value FROM counters WHERE name = 'ticket'").get().value, 1500);
});
