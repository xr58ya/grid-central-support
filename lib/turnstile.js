// Cloudflare Turnstile: checks the "I'm human" token the report form sends.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Returns { ok: true } or { ok: false, reason }. Never throws. */
export async function verifyTurnstile(env, token, remoteIp) {
  if (!env.TURNSTILE_SECRET) return { ok: false, reason: 'not-configured' };
  if (typeof token !== 'string' || !token || token.length > 2048) return { ok: false, reason: 'missing-token' };
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);
  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body: body, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { ok: false, reason: 'verify-http-' + res.status };
    const out = await res.json();
    if (out && out.success === true) return { ok: true, hostname: out.hostname || null };
    return { ok: false, reason: (out && out['error-codes'] && out['error-codes'].join(',')) || 'failed' };
  } catch (err) {
    return { ok: false, reason: 'verify-error' };
  }
}
