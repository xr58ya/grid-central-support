// POST /api/tickets and GET /api/config, run in Node against stand-ins for D1, R2, Turnstile and Resend.

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/tickets.js';
import { onRequestGet as config } from '../functions/api/config.js';
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
  assert.equal(ack.from, 'Grid Central Support <support@getgridcentral.com>');
  assert.equal(ack.reply_to, 'support@getgridcentral.com');
  assert.match(ack.subject, /^\[GC-1001\]/);
  assert.match(ack.text, /GC-1001/);
  assert.doesNotMatch(ack.text + ack.subject, /Spotter stops/, 'the confirmation repeats none of the sender\'s words');
  assert.match(owner.subject, /^\[GC-1001\] New bug report: Spotter stops calling cars after pitting \(0\.5\.9\.2\)$/);
  assert.match(owner.text, /From: driver@example.com/);
  assert.match(owner.text, /Steps to reproduce:\n1\. Join a race/);
  assert.match(owner.text, /companion\.log \(1 KB\)/);
  assert.match(owner.text, /https:\/\/support\.getgridcentral\.com\/admin\/#\/GC-1001/);
  assert.equal(owner.reply_to, undefined);

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
  let r = await post(env, { token: 'bad-token' });
  assert.equal(r.res.status, 403);
  assert.equal(r.body.retryCheck, true);
  r = await post(env, { token: '' });
  assert.equal(r.res.status, 403);
  assert.equal(rows(env, 'SELECT COUNT(*) AS n FROM tickets')[0].n, 0);
  assert.equal(net.emails.length, 0);
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

test('requests that aren\'t the form are refused', async function () {
  const env = baseEnv();
  const json = new Request('https://support.getgridcentral.com/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal((await onRequestPost(context(json, env))).status, 415);
  const fd = new FormData();
  fd.append('payload', 'not json');
  const bad = new Request('https://support.getgridcentral.com/api/tickets', { method: 'POST', body: fd });
  assert.equal((await onRequestPost(context(bad, env))).status, 400);
  const huge = new Request('https://support.getgridcentral.com/api/tickets', { method: 'POST', body: fd, headers: { 'Content-Length': String(40 * 1024 * 1024) } });
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
