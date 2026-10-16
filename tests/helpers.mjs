// Test stand-ins for Cloudflare: D1 on Node's built-in SQLite, R2 in memory, a fake fetch for Turnstile, Resend
// and the Access keys, and signed Access tokens. No network is used.

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MIGRATION = fs.readFileSync(path.join(ROOT, 'migrations', '0001_init.sql'), 'utf8');

// Enough of the D1 API for these functions: prepare().bind().first()/all()/run(), and batch() as one transaction.
export function makeD1() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(MIGRATION);
  function exec(sql, args) {
    const st = db.prepare(sql);
    const clean = args.map(function (a) { return a === undefined ? null : a; });
    if (/^\s*(SELECT|WITH)\b/i.test(sql) || /\bRETURNING\b/i.test(sql)) return { results: st.all(...clean).map(function (r) { return Object.assign({}, r); }), meta: {} };
    const r = st.run(...clean);
    return { results: [], meta: { changes: r.changes, last_row_id: Number(r.lastInsertRowid) } };
  }
  function stmt(sql, args) {
    return {
      bind: function () { return stmt(sql, Array.from(arguments)); },
      first: async function (col) { const r = exec(sql, args).results[0] || null; return col ? (r ? r[col] : null) : r; },
      all: async function () { return Object.assign({ success: true }, exec(sql, args)); },
      run: async function () { return Object.assign({ success: true }, exec(sql, args)); },
      _exec: function () { return exec(sql, args); }
    };
  }
  return {
    sqlite: db,
    prepare: function (sql) { return stmt(sql, []); },
    batch: async function (stmts) {
      db.exec('BEGIN');
      try {
        const out = stmts.map(function (s) { return Object.assign({ success: true }, s._exec()); });
        db.exec('COMMIT');
        return out;
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    }
  };
}

export function makeR2() {
  const store = new Map();
  return {
    store: store,
    failPuts: false,
    put: async function (key, value, opts) {
      if (this.failPuts) throw new Error('R2 is down');
      const buf = value instanceof Blob ? new Uint8Array(await value.arrayBuffer()) : new Uint8Array(value);
      store.set(key, { buf: buf, opts: opts || {} });
      return { key: key };
    },
    get: async function (key, opts) {
      const o = store.get(key);
      if (!o) return null;
      let buf = o.buf;
      if (opts && opts.range && opts.range.suffix != null) buf = buf.slice(Math.max(0, buf.length - opts.range.suffix));
      return {
        size: o.buf.length,
        body: new Blob([buf]).stream(),
        arrayBuffer: async function () { return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength); },
        httpMetadata: o.opts.httpMetadata
      };
    },
    delete: async function (keys) {
      [].concat(keys).forEach(function (k) { store.delete(k); });
    }
  };
}

// The fake internet: Turnstile accepts the token "good-token"; Resend records emails (or fails when told to).
export function installFetch(state) {
  state.emails = [];
  state.turnstileCalls = 0;
  state.keyFetches = 0;
  globalThis.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : input.url;
    if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      state.turnstileCalls++;
      const token = init.body.get('response');
      if (init.body.get('secret') !== 'test-turnstile-secret') return Response.json({ success: false, 'error-codes': ['invalid-input-secret'] });
      return Response.json(token === 'good-token' ? { success: true, hostname: 'support.getgridcentral.com' } : { success: false, 'error-codes': ['invalid-input-response'] });
    }
    if (url === 'https://api.resend.com/emails') {
      const body = JSON.parse(init.body);
      if (state.resendDown) return new Response('{"message":"internal error"}', { status: 500 });
      state.emails.push({ body: body, headers: init.headers });
      return Response.json({ id: 'email-' + state.emails.length });
    }
    if (url === 'https://gcteam.cloudflareaccess.com/cdn-cgi/access/certs') {
      state.keyFetches++;
      return Response.json({ keys: state.jwks || [] });
    }
    throw new Error('Unexpected fetch in a test: ' + url);
  };
}

function b64url(bytes) {
  return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// An Access-like signing key, and tokens signed with it.
export async function makeAccessKey(kid) {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']);
  const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  return {
    jwk: { kid: kid, kty: jwk.kty, alg: 'RS256', use: 'sig', e: jwk.e, n: jwk.n },
    sign: async function (claims) {
      const head = b64url(Buffer.from(JSON.stringify({ alg: 'RS256', kid: kid, typ: 'JWT' })));
      const body = b64url(Buffer.from(JSON.stringify(claims)));
      const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(head + '.' + body));
      return head + '.' + body + '.' + b64url(new Uint8Array(sig));
    }
  };
}

export const ADMIN = 'owner@example.com';
export const AUD = 'aud-tag-123';

export function baseEnv(overrides) {
  return Object.assign({
    DB: makeD1(),
    FILES: makeR2(),
    TURNSTILE_SITE_KEY: 'test-site-key',
    TURNSTILE_SECRET: 'test-turnstile-secret',
    RESEND_API_KEY: 're_test',
    OWNER_EMAIL: 'owner-inbox@example.com',
    ADMIN_EMAILS: ADMIN + ', second@example.com',
    ACCESS_TEAM_DOMAIN: 'gcteam',
    ACCESS_AUD: AUD
  }, overrides || {});
}

// A Pages Functions context. Promises given to waitUntil are kept so a test can wait for them.
export function context(request, env, params) {
  const waits = [];
  return {
    request: request,
    env: env,
    params: params || {},
    data: {},
    waitUntil: function (p) { waits.push(p); },
    next: async function () { return new Response('next'); },
    settle: function () { return Promise.all(waits); }
  };
}

export const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);

export function bugAnswers(extra) {
  return Object.assign({
    summary: 'Spotter stops calling cars after pitting',
    version: 'V 0.5.9.2 · BETA',
    area: ['Engineer, strategy or coach', 'Talkback / voice / commentary'],
    'what-happened': 'After my first stop the spotter went quiet. I expected it to keep calling cars.',
    steps: '1. Join a race\n2. Pit\n3. Rejoin',
    frequency: 'Every time',
    session: 'Porsche 963 at Spa, team race',
    os: 'Windows 11 23H2',
    hardware: '',
    logs: '12:01:02 ERROR spotter: socket closed'
  }, extra || {});
}

export function ticketRequest(opts) {
  const fd = new FormData();
  fd.append('payload', JSON.stringify({ type: opts.type || 'bug', email: opts.email || 'driver@example.com', answers: opts.answers || bugAnswers() }));
  fd.append('turnstile', opts.token === undefined ? 'good-token' : opts.token);
  (opts.files || []).forEach(function (f) { fd.append('files', new File([f.bytes], f.name, { type: f.type || 'application/octet-stream' })); });
  return new Request('https://support.getgridcentral.com/api/tickets', { method: 'POST', body: fd, headers: { 'CF-Connecting-IP': '203.0.113.9' } });
}
