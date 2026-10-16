// The admin API: who gets in (Access email header + signed Access token + ADMIN_EMAILS), and what it does.

import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { onRequestPost as postTicket } from '../functions/api/tickets.js';
import { onRequest as middleware } from '../functions/api/admin/_middleware.js';
import { onRequestGet as me } from '../functions/api/admin/me.js';
import { onRequestGet as list } from '../functions/api/admin/tickets/index.js';
import { onRequestGet as getOne, onRequestPatch as patchOne, onRequestDelete as deleteOne } from '../functions/api/admin/tickets/[id].js';
import { onRequestPost as addNote } from '../functions/api/admin/tickets/[id]/notes.js';
import { onRequestPost as reply } from '../functions/api/admin/tickets/[id]/reply.js';
import { onRequestGet as getFile } from '../functions/api/admin/files/[id].js';
import { clearAccessKeyCache } from '../lib/access.js';
import { ADMIN, AUD, PNG, ROOT, baseEnv, bugAnswers, context, installFetch, makeAccessKey, ticketRequest } from './helpers.mjs';

const net = {};
let key, otherKey;
const SITE = 'https://support.getgridcentral.com';

before(async function () {
  key = await makeAccessKey('k1');
  otherKey = await makeAccessKey('k2');
});
beforeEach(function () {
  net.resendDown = false;
  installFetch(net);
  net.jwks = [key.jwk];
  clearAccessKeyCache();
});

function claims(extra) {
  const now = Math.floor(Date.now() / 1000);
  return Object.assign({ aud: [AUD], email: ADMIN, exp: now + 3600, iat: now, iss: 'https://gcteam.cloudflareaccess.com', sub: 'u1' }, extra || {});
}

async function req(p, opts) {
  opts = opts || {};
  const headers = {};
  if (opts.email !== null) headers['Cf-Access-Authenticated-User-Email'] = opts.email || ADMIN;
  if (opts.jwt !== null) headers['Cf-Access-Jwt-Assertion'] = opts.jwt || await (opts.signer || key).sign(claims(opts.claims));
  const method = opts.method || 'GET';
  if (method !== 'GET' && opts.origin !== null) headers['Origin'] = opts.origin || SITE;
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  return new Request((opts.site || SITE) + p, { method: method, headers: headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
}

async function call(handler, env, request, params) {
  const res = await handler(context(request, env, params));
  const type = res.headers.get('Content-Type') || '';
  return { res: res, body: /json/.test(type) ? await res.json() : null };
}

async function seed(env) {
  const log = 'boot\n12:00 ERROR overlay failed to start\n    at start (x.js:1)\nok\n';
  const tickets = [
    { answers: bugAnswers(), files: [{ name: 'companion.log', bytes: new TextEncoder().encode(log) }, { name: 'shot.png', bytes: PNG }] },
    { type: 'feature', email: 'idea@example.com', answers: { summary: 'Teammate pit warning', area: ['Something new'], problem: 'p', solution: 's', importance: 'Nice to have' } },
    { type: 'help', email: 'help@example.com', answers: { summary: 'Cannot connect OBS <script>alert(1)</script>', version: '0.5.8', area: ['Overlays (in-game or OBS)'], goal: 'g', tried: 't' } }
  ];
  for (const t of tickets) {
    const ctx = context(ticketRequest(t), env);
    const r = await postTicket(ctx);
    assert.equal(r.status, 201);
    await ctx.settle();
  }
  net.emails = [];
}

test('admin sign-in: every missing or wrong piece is refused', async function () {
  const env = baseEnv();
  const cases = [
    ['no ADMIN_EMAILS', baseEnv({ ADMIN_EMAILS: '' }), {}, 403],
    ['no Access token or email header', env, { email: null, jwt: null }, 401],
    ['someone not on ADMIN_EMAILS', env, { email: 'stranger@example.com', claims: { email: 'stranger@example.com' } }, 403],
    ['no Access token (header typed by hand)', env, { jwt: null }, 401],
    ['token with no email in it', env, { email: null, claims: { email: undefined } }, 403],
    ['token not signed by the team', env, { signer: otherKey }, 403],
    ['token for another email', env, { claims: { email: 'second@example.com' } }, 403],
    ['token for another application', env, { claims: { aud: ['other-aud'] } }, 403],
    ['expired token', env, { claims: { exp: Math.floor(Date.now() / 1000) - 600 } }, 403],
    ['token from another team', env, { claims: { iss: 'https://evil.cloudflareaccess.com' } }, 403],
    ['Access not configured', baseEnv({ ACCESS_AUD: '' }), {}, 403],
    ['LOCAL_DEV_ADMIN does nothing off localhost', baseEnv({ LOCAL_DEV_ADMIN: ADMIN }), { email: null, jwt: null }, 401]
  ];
  for (const [name, e, opts, status] of cases) {
    const r = await call(me, e, await req('/api/admin/me', opts));
    assert.equal(r.res.status, status, name);
    assert.equal(r.body.ok, false, name);
    const m = await middleware(context(await req('/api/admin/me', opts), e));
    assert.equal(m.status, status, name + ' (middleware)');
  }
  const forged = (await key.sign(claims())).replace(/\.[^.]+$/, '.' + Buffer.from('nope').toString('base64url'));
  assert.equal((await call(me, env, await req('/api/admin/me', { jwt: forged }))).res.status, 403, 'bad signature');
});

test('admin sign-in: a guessed email header gets the same answer whether or not it is on ADMIN_EMAILS', async function () {
  const env = baseEnv();
  const site = 'https://grid-central-support.pages.dev';
  const junk = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0.eyJlbWFpbCI6Im93bmVyQGV4YW1wbGUuY29tIn0.bm9wZQ';
  for (const jwt of [null, junk]) {
    const answers = [];
    for (const email of [ADMIN, 'guess@example.com']) {
      const r = await call(me, env, await req('/api/admin/me', { site: site, email: email, jwt: jwt }));
      answers.push([r.res.status, r.body.error]);
    }
    assert.deepEqual(answers[0], answers[1], 'token ' + (jwt ? 'junk' : 'missing'));
  }
  // The email inside a valid token is what counts: no header needed, and a different header is refused.
  assert.equal((await call(me, env, await req('/api/admin/me', { email: null }))).res.status, 200);
  assert.equal((await call(me, env, await req('/api/admin/me', { claims: { email: 'stranger@example.com' } }))).res.status, 403);
});

test('admin sign-in: made-up key ids fetch the Access keys again at most once a minute', async function () {
  const env = baseEnv();
  assert.equal((await call(me, env, await req('/api/admin/me'))).res.status, 200);
  assert.equal(net.keyFetches, 1);
  for (let i = 0; i < 5; i++) {
    const fake = await makeAccessKey('made-up-' + i);
    assert.equal((await call(me, env, await req('/api/admin/me', { signer: fake }))).res.status, 403);
  }
  assert.equal(net.keyFetches, 2, 'one forced refresh, then the cooldown');
  const odd = [Buffer.from(JSON.stringify({ alg: 'RS256', kid: '../../x' })).toString('base64url'), Buffer.from('{}').toString('base64url'), 'x'].join('.');
  assert.equal((await call(me, env, await req('/api/admin/me', { jwt: odd }))).res.status, 403);
  assert.equal(net.keyFetches, 2, 'a malformed key id is refused without fetching');
});

test('admin sign-in: the right person with a valid Access token gets in, in any letter case', async function () {
  const env = baseEnv();
  const r = await call(me, env, await req('/api/admin/me', { email: 'Owner@Example.com' }));
  assert.equal(r.res.status, 200);
  assert.equal(r.body.email, ADMIN);
  assert.deepEqual(r.body.setup, { database: true, files: true, turnstile: true, email: true, ownerEmail: true });
  assert.equal(r.body.statuses.map(function (s) { return s.label; }).join(', '), 'New, Needs info, Confirmed, Fixed in dev, Closed');
  assert.equal(r.res.headers.get('Cache-Control'), 'no-store');
  const m = await middleware(context(await req('/api/admin/me'), env));
  assert.equal(await m.text(), 'next');
  assert.equal(m.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  // Access keys are fetched once and kept.
  await call(me, env, await req('/api/admin/me'));
  assert.equal(net.keyFetches, 1);
});

test('admin sign-in: a rotated Access key is fetched again', async function () {
  const env = baseEnv();
  assert.equal((await call(me, env, await req('/api/admin/me'))).res.status, 200);
  net.jwks = [key.jwk, otherKey.jwk];
  assert.equal((await call(me, env, await req('/api/admin/me', { signer: otherKey }))).res.status, 200);
  assert.equal(net.keyFetches, 2);
});

test('admin changes must come from the admin page (same origin)', async function () {
  const env = baseEnv();
  await seed(env);
  let r = await call(addNote, env, await req('/api/admin/tickets/GC-1001/notes', { method: 'POST', body: { body: 'x' }, origin: null }), { id: 'GC-1001' });
  assert.equal(r.res.status, 403);
  r = await call(addNote, env, await req('/api/admin/tickets/GC-1001/notes', { method: 'POST', body: { body: 'x' }, origin: 'https://evil.example' }), { id: 'GC-1001' });
  assert.equal(r.res.status, 403);
  const plain = await req('/api/admin/tickets/GC-1001/notes', { method: 'POST' });
  const textBody = new Request(plain, { body: '{"body":"x"}', headers: Object.assign(Object.fromEntries(plain.headers), { 'Content-Type': 'text/plain' }) });
  r = await call(addNote, env, textBody, { id: 'GC-1001' });
  assert.equal(r.res.status, 415, 'only JSON');
});

test('ticket list: newest first, with filters and counts', async function () {
  const env = baseEnv();
  await seed(env);
  const ids = async function (q) {
    const r = await call(list, env, await req('/api/admin/tickets' + q));
    assert.equal(r.res.status, 200, q + ' ' + JSON.stringify(r.body));
    return r.body.tickets.map(function (t) { return t.number; });
  };
  assert.deepEqual(await ids(''), ['GC-1003', 'GC-1002', 'GC-1001']);
  assert.deepEqual(await ids('?type=bug'), ['GC-1001']);
  assert.deepEqual(await ids('?status=new'), ['GC-1003', 'GC-1002', 'GC-1001']);
  assert.deepEqual(await ids('?status=closed'), []);
  assert.deepEqual(await ids('?area=' + encodeURIComponent('Something new')), ['GC-1002']);
  assert.deepEqual(await ids('?version=0.5.9.2'), ['GC-1001']);
  assert.deepEqual(await ids('?version=0.5'), ['GC-1003', 'GC-1001'], '0.5 matches every 0.5.x');
  assert.deepEqual(await ids('?version=0.5.1'), [], 'whole parts only: 0.5.1 doesn\'t match 0.5.10');
  assert.deepEqual(await ids('?version=0.5.9'), ['GC-1001']);
  assert.deepEqual(await ids('?version=V%200.5.8%20%C2%B7%20BETA'), ['GC-1003']);
  assert.deepEqual(await ids('?q=GC-1002'), ['GC-1002']);
  assert.deepEqual(await ids('?q=obs'), ['GC-1003']);
  assert.deepEqual(await ids('?q=idea%40example'), ['GC-1002']);
  assert.deepEqual(await ids('?q=Join%20a%20race'), ['GC-1001'], 'searches the answers too');
  assert.deepEqual(await ids('?q=%25'), [], '% is matched as itself');
  assert.deepEqual(await ids('?q=' + encodeURIComponent("' OR 1=1 --")), []);
  const r = await call(list, env, await req('/api/admin/tickets'));
  assert.deepEqual(r.body.counts, { new: 3 });
  assert.equal(r.body.tickets[2].fileCount, 2);
  assert.equal(r.body.tickets[2].answers, undefined, 'the list leaves out the answers');
  for (const bad of ['?type=x', '?status=x', '?area=x', '?priority=x', '?version=abc']) {
    assert.equal((await call(list, env, await req('/api/admin/tickets' + bad))).res.status, 400, bad);
  }
});

test('ticket search looks at what was typed, not the stored JSON; Load more pages by ticket number', async function () {
  const env = baseEnv();
  await seed(env);
  const ctx = context(ticketRequest({ email: 'path@example.com', answers: bugAnswers({ steps: 'Open C:\\Users\\me\\AppData', 'what-happened': 'It said "Connection lost"' }) }), env);
  assert.equal((await postTicket(ctx)).status, 201);
  await ctx.settle();
  const ids = async function (q) {
    const r = await call(list, env, await req('/api/admin/tickets' + q));
    assert.equal(r.res.status, 200, q + ' ' + JSON.stringify(r.body));
    return r.body.tickets.map(function (t) { return t.number; });
  };
  assert.deepEqual(await ids('?q=' + encodeURIComponent('C:\\Users')), ['GC-1004']);
  assert.deepEqual(await ids('?q=' + encodeURIComponent('"Connection lost"')), ['GC-1004']);
  assert.deepEqual(await ids('?q=steps'), [], 'field names are not searched');
  assert.deepEqual(await ids('?q=Talkback'), ['GC-1004', 'GC-1001'], 'the area picks are searched');
  assert.deepEqual(await ids('?before=GC-1003'), ['GC-1002', 'GC-1001']);
  assert.deepEqual(await ids('?type=bug&before=1004'), ['GC-1001']);
});

test('status and priority: only what changed is saved, and a page that is out of date is told to reload', async function () {
  const env = baseEnv();
  await seed(env);
  const send = async function (body) {
    return call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: body }), { id: 'GC-1001' });
  };
  // Two tabs opened GC-1001 (new, priority not set). Tab B sets the priority; tab A then changes the status only.
  let r = await send({ priority: 'high', from: { status: 'new', priority: 'none' } });
  assert.equal(r.res.status, 200);
  r = await send({ status: 'confirmed', from: { status: 'new', priority: 'none' } });
  assert.equal(r.res.status, 200, JSON.stringify(r.body));
  assert.deepEqual([r.body.ticket.status, r.body.ticket.priority], ['confirmed', 'high'], 'tab B\'s priority stays');
  // Tab A still thinks the status is "new": changing it again is refused, and nothing is saved or emailed.
  r = await send({ status: 'needs_info', notify: true, from: { status: 'new', priority: 'none' } });
  assert.equal(r.res.status, 409);
  assert.match(r.body.error, /changed somewhere else/);
  const d = (await call(getOne, env, await req('/api/admin/tickets/GC-1001'), { id: 'GC-1001' })).body;
  assert.equal(d.ticket.status, 'confirmed');
  assert.equal(net.emails.length, 0);
  assert.deepEqual(d.events.filter(function (e) { return e.kind === 'status' || e.kind === 'priority'; }).map(function (e) { return e.kind + ' ' + e.meta.from + '>' + e.meta.to; }),
    ['priority none>high', 'status new>confirmed']);
});

test('ticket detail, status change with an email to the customer, priority, note and reply', async function () {
  const env = baseEnv();
  await seed(env);
  let r = await call(getOne, env, await req('/api/admin/tickets/GC-1003'), { id: 'GC-1003' });
  assert.equal(r.res.status, 200);
  assert.equal(r.body.ticket.summary, 'Cannot connect OBS <script>alert(1)</script>', 'stored as typed; the admin page shows it as text');
  assert.equal(r.body.form.name, 'Setup help');
  assert.equal((await call(getOne, env, await req('/api/admin/tickets/GC-9999'), { id: 'GC-9999' })).res.status, 404);
  assert.equal((await call(getOne, env, await req('/api/admin/tickets/abc'), { id: 'abc' })).res.status, 404);

  r = await call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: { status: 'needs_info', notify: true, message: 'Which car were you in?' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.ticket.status, 'needs_info');
  assert.equal(net.emails.length, 1);
  assert.equal(net.emails[0].body.to[0], 'driver@example.com');
  assert.equal(net.emails[0].body.subject, '[GC-1001] Update: Needs info');
  assert.match(net.emails[0].body.text, /Which car were you in\?/);
  const st = r.body.events.find(function (e) { return e.kind === 'status'; });
  assert.deepEqual([st.actor, st.meta.from, st.meta.to, st.meta.notified, st.meta.ok], [ADMIN, 'new', 'needs_info', true, true]);

  r = await call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: { priority: 'high' } }), { id: 'GC-1001' });
  assert.equal(r.body.ticket.priority, 'high');
  assert.equal(net.emails.length, 1, 'no email without notify');
  r = await call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: { status: 'confirmed' } }), { id: 'GC-1001' });
  assert.equal(net.emails.length, 1, 'no email without notify');
  for (const bad of [{ status: 'done' }, { priority: 'urgent' }, { status: 'confirmed' }]) {
    assert.equal((await call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: bad }), { id: 'GC-1001' })).res.status, 400, JSON.stringify(bad));
  }

  net.resendDown = true;
  r = await call(patchOne, env, await req('/api/admin/tickets/GC-1001', { method: 'PATCH', body: { status: 'fixed_in_dev', notify: true } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200);
  assert.match(r.body.warning, /email to the customer failed/);
  net.resendDown = false;

  r = await call(addNote, env, await req('/api/admin/tickets/GC-1001/notes', { method: 'POST', body: { body: 'Reproduced on Spa.' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200);
  const note = r.body.events.find(function (e) { return e.kind === 'note'; });
  assert.equal(note.body, 'Reproduced on Spa.');
  assert.equal(net.emails.length, 1, 'notes are never emailed');
  assert.equal((await call(addNote, env, await req('/api/admin/tickets/GC-1001/notes', { method: 'POST', body: { body: '  ' } }), { id: 'GC-1001' })).res.status, 400);

  r = await call(reply, env, await req('/api/admin/tickets/GC-1001/reply', { method: 'POST', body: { body: 'Thanks, fixed in the next update.' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200);
  const sent = net.emails[net.emails.length - 1].body;
  assert.equal(sent.to[0], 'driver@example.com');
  assert.equal(sent.subject, 'Re: [GC-1001] Spotter stops calling cars after pitting');
  assert.match(sent.text, /^Thanks, fixed in the next update\./);
  assert.equal(sent.reply_to, 'support@getgridcentral.com');

  net.resendDown = true;
  r = await call(reply, env, await req('/api/admin/tickets/GC-1001/reply', { method: 'POST', body: { body: 'Second try' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 502);
  assert.match(r.body.warning, /saved in the history/);
  const replies = r.body.events.filter(function (e) { return e.kind === 'reply'; });
  assert.deepEqual(replies.map(function (e) { return [e.body, e.meta.ok]; }), [['Thanks, fixed in the next update.', true], ['Second try', false]]);
});

test('files: downloads are attachments with nosniff, screenshots can show inline, logs give error lines', async function () {
  const env = baseEnv();
  await seed(env);
  const d = (await call(getOne, env, await req('/api/admin/tickets/GC-1001'), { id: 'GC-1001' })).body;
  const log = d.files.find(function (f) { return f.kind === 'log'; });
  const png = d.files.find(function (f) { return f.kind === 'image'; });

  let res = await getFile(context(await req('/api/admin/files/' + log.id), env, { id: log.id }));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Disposition'), 'attachment; filename="companion.log"; filename*=UTF-8\'\'companion.log');
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.match(res.headers.get('Content-Security-Policy'), /sandbox/);
  assert.match(await res.text(), /ERROR overlay failed/);

  res = await getFile(context(await req('/api/admin/files/' + log.id + '?inline=1'), env, { id: log.id }));
  assert.match(res.headers.get('Content-Disposition'), /^attachment/, 'logs never show inline');
  res = await getFile(context(await req('/api/admin/files/' + png.id + '?inline=1'), env, { id: png.id }));
  assert.match(res.headers.get('Content-Disposition'), /^inline/);
  assert.equal(res.headers.get('Content-Type'), 'image/png');

  const lines = await call(getFile, env, await req('/api/admin/files/' + log.id + '?lines=errors'), { id: log.id });
  assert.deepEqual(lines.body.lines, ['12:00 ERROR overlay failed to start', '    at start (x.js:1)']);
  assert.equal((await call(getFile, env, await req('/api/admin/files/' + png.id + '?lines=errors'), { id: png.id })).res.status, 400);
  assert.equal((await call(getFile, env, await req('/api/admin/files/nothex'), { id: 'nothex' })).res.status, 404);
  assert.equal((await call(getFile, env, await req('/api/admin/files/' + 'a'.repeat(32)), { id: 'a'.repeat(32) })).res.status, 404);
  assert.equal((await getFile(context(await req('/api/admin/files/' + log.id, { jwt: null }), env, { id: log.id }))).status, 401, 'needs the admin sign-in');
});

test('delete: needs the number typed, removes the ticket, history and files, and numbers are never reused', async function () {
  const env = baseEnv();
  await seed(env);
  let r = await call(deleteOne, env, await req('/api/admin/tickets/GC-1001', { method: 'DELETE', body: { confirm: 'GC-1002' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 400);
  assert.equal(env.FILES.store.size, 2);
  r = await call(deleteOne, env, await req('/api/admin/tickets/GC-1003', { method: 'DELETE', body: { confirm: 'GC-1003' } }), { id: 'GC-1003' });
  assert.equal(r.res.status, 200);
  r = await call(deleteOne, env, await req('/api/admin/tickets/GC-1001', { method: 'DELETE', body: { confirm: 'gc-1001' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200);
  assert.equal(env.FILES.store.size, 0);
  const left = env.DB.sqlite.prepare('SELECT (SELECT COUNT(*) FROM tickets) AS t, (SELECT COUNT(*) FROM ticket_files) AS f, (SELECT COUNT(*) FROM ticket_events WHERE ticket_id IN (1001, 1003)) AS e').get();
  assert.deepEqual(Object.assign({}, left), { t: 1, f: 0, e: 0 });
  const ctx = context(ticketRequest({ email: 'new@example.com' }), env);
  const res = await postTicket(ctx);
  await ctx.settle();
  assert.equal((await res.json()).ticket, 'GC-1004');
});

test('delete: files are removed from storage first (even ones with no database row), and a storage failure keeps the ticket', async function () {
  const env = baseEnv();
  await seed(env);
  await env.FILES.put('tickets/GC-1001/' + 'f'.repeat(32) + '/orphan.log', new TextEncoder().encode('left behind'));
  await env.FILES.put('tickets/GC-10010/x/other.log', new TextEncoder().encode('another ticket'));
  env.FILES.failDeletes = true;
  let r = await call(deleteOne, env, await req('/api/admin/tickets/GC-1001', { method: 'DELETE', body: { confirm: 'GC-1001' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 502);
  assert.equal((await call(getOne, env, await req('/api/admin/tickets/GC-1001'), { id: 'GC-1001' })).res.status, 200, 'still there to try again');
  env.FILES.failDeletes = false;
  r = await call(deleteOne, env, await req('/api/admin/tickets/GC-1001', { method: 'DELETE', body: { confirm: 'GC-1001' } }), { id: 'GC-1001' });
  assert.equal(r.res.status, 200);
  assert.deepEqual(Array.from(env.FILES.store.keys()), ['tickets/GC-10010/x/other.log']);

  const noFiles = Object.assign({}, env, { FILES: undefined });
  const ctx = context(ticketRequest({ email: 'x@example.com', files: [{ name: 'shot.png', bytes: PNG }] }), env);
  assert.equal((await postTicket(ctx)).status, 201);
  await ctx.settle();
  r = await call(deleteOne, noFiles, await req('/api/admin/tickets/GC-1004', { method: 'DELETE', body: { confirm: 'GC-1004' } }), { id: 'GC-1004' });
  assert.equal(r.res.status, 503, 'files it can\'t reach are never left behind silently');
  r = await call(deleteOne, noFiles, await req('/api/admin/tickets/GC-1002', { method: 'DELETE', body: { confirm: 'GC-1002' } }), { id: 'GC-1002' });
  assert.equal(r.res.status, 200, 'a ticket with no files can go without storage');
});

test('the admin page puts ticket text in with textContent only', function () {
  const js = fs.readFileSync(path.join(ROOT, 'admin', 'admin.js'), 'utf8');
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/);
  const html = fs.readFileSync(path.join(ROOT, 'admin', 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<script>(?!\s*<\/script>)/, 'no inline scripts (the admin CSP allows only its own files)');
});

test('"Copy for development" gives version, track, car, session, steps, expected, actual, frequency and log lines', function () {
  const sandbox = {};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'admin', 'devtext.js'), 'utf8'), sandbox);
  const dev = sandbox.GCDev;
  assert.deepEqual({ ...dev.parseSession('Porsche 963 at Spa, team race') }, { car: 'Porsche 963', track: 'Spa', kind: 'team race' });
  assert.deepEqual({ ...dev.parseSession('Spa race') }, { car: '', track: '', kind: '' });
  assert.deepEqual({ ...dev.splitExpected('The spotter went quiet. I expected it to keep calling.') },
    { actual: 'The spotter went quiet.', expected: 'I expected it to keep calling.' });
  assert.deepEqual({ ...dev.splitExpected('It crashed.\nExpected: no crash') }, { actual: 'It crashed.', expected: 'no crash' });
  assert.deepEqual({ ...dev.splitExpected('It just crashes') }, { actual: 'It just crashes', expected: '' });
  assert.deepEqual({ ...dev.splitExpected('After pitting the spotter went quiet.\nExpected: it keeps calling cars\nActual: silence until I restart Grid Central') },
    { actual: 'After pitting the spotter went quiet.\nsilence until I restart Grid Central', expected: 'it keeps calling cars' });
  assert.deepEqual({ ...dev.splitExpected('It crashed when I pit. I expect it is because of the update.') },
    { actual: 'It crashed when I pit. I expect it is because of the update.', expected: '' }, 'a guess is not an expectation');
  assert.deepEqual({ ...dev.splitExpected('It crashed. I\'d expect it to keep running.') }, { actual: 'It crashed.', expected: 'I\'d expect it to keep running.' });
  assert.deepEqual({ ...dev.parseSession('Official race at Daytona in the Mustang GT3') }, { car: 'Mustang GT3', track: 'Daytona', kind: 'Official race' });
  assert.deepEqual({ ...dev.parseSession('Practice at Spa') }, { car: '', track: 'Spa', kind: 'Practice' });
  assert.deepEqual({ ...dev.parseSession('Porsche 963 at Spa in the rain') }, { car: 'Porsche 963', track: 'Spa in the rain', kind: '' });
  const failed = dev.devText({ ticket: { number: 'GC-1002', type: 'bug', summary: 's', answers: {} }, form: { name: 'Bug report', fields: [] }, files: [] },
    [{ filename: 'companion.log', failed: true }]);
  assert.ok(failed.indexOf('companion.log: couldn\'t be read') >= 0, failed);
  assert.equal(failed.indexOf('(error lines)'), -1);

  const answers = bugAnswers();
  const text = dev.devText({
    ticket: { number: 'GC-1001', type: 'bug', summary: answers.summary, answers: Object.assign({}, answers, { version: '0.5.9.2' }) },
    form: { name: 'Bug report', fields: [] },
    files: [{ filename: 'companion.log', size: 2048, kind: 'log' }]
  }, [{ filename: 'companion.log', lines: ['12:00 ERROR overlay failed'], partial: false }]);
  const want = ['GC-1001 · Bug report · Spotter stops calling cars after pitting', 'Version: 0.5.9.2', 'Track: Spa', 'Car: Porsche 963',
    'Session: Porsche 963 at Spa, team race', 'Steps:\n1. Join a race', 'Expected: I expected it to keep calling cars.',
    'Actual: After my first stop the spotter went quiet.', 'Frequency: Every time', 'companion.log lines:\nPasted by the customer:\n12:01:02 ERROR spotter: socket closed',
    'companion.log (error lines):\n12:00 ERROR overlay failed', '- companion.log (2 KB)'];
  for (const w of want) assert.ok(text.indexOf(w) >= 0, 'missing: ' + w + '\n---\n' + text);
});
