// Cloudflare Turnstile: checks the "I'm human" token the report form sends.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// The only answers that doing the check again can fix. Anything else (a wrong or missing secret, Turnstile down or
// slow, a token from another site) won't go away by retrying, so the form offers email instead.
const USER_FIXABLE = ['missing-token', 'invalid-input-response', 'timeout-or-duplicate'];

function result(reason) {
  const codes = String(reason).split(',');
  return { ok: false, reason: reason, retry: codes.every(function (c) { return USER_FIXABLE.indexOf(c) >= 0; }) };
}

/**
 * Returns { ok: true, hostname } or { ok: false, reason, retry }. Never throws.
 * expectedHostname: the site the check must have been done on (null to skip, for local testing).
 */
export async function verifyTurnstile(env, token, remoteIp, expectedHostname) {
  if (!env.TURNSTILE_SECRET) return result('not-configured');
  if (typeof token !== 'string' || !token || token.length > 2048) return result('missing-token');
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);
  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body: body, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return result('verify-http-' + res.status);
    const out = await res.json();
    if (!out || out.success !== true) return result((out && out['error-codes'] && out['error-codes'].join(',')) || 'failed');
    if (expectedHostname && out.hostname !== expectedHostname) return result('wrong-hostname:' + out.hostname);
    return { ok: true, hostname: out.hostname || null };
  } catch (err) {
    return result('verify-error');
  }
}
