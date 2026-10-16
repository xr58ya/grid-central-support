// Cloudflare Access: checks the signed token Access adds to every request it lets through
// (the Cf-Access-Jwt-Assertion header). https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
//
// The email header alone could be typed by anyone if Access were ever switched off for a path (or on the
// *.pages.dev address, which Access on the custom domain doesn't cover). The token can't be faked: it's signed by
// Cloudflare with keys published for the team.

const keyCache = new Map(); // team domain -> { at, keys }
const KEY_TTL_MS = 60 * 60 * 1000;

// "myteam", "myteam.cloudflareaccess.com" or "https://myteam.cloudflareaccess.com/" -> "myteam.cloudflareaccess.com"
export function normalizeTeamDomain(text) {
  let s = String(text || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!s) return '';
  if (s.indexOf('.') < 0) s += '.cloudflareaccess.com';
  // Access team domains are always <team>.cloudflareaccess.com: anything else is a typo, not a key server to trust.
  return /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(s) ? s : '';
}

function b64urlBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlBytes(s)));
}

async function getKeys(team, fetchFn, force) {
  const cached = keyCache.get(team);
  if (!force && cached && Date.now() - cached.at < KEY_TTL_MS) return cached.keys;
  const res = await fetchFn('https://' + team + '/cdn-cgi/access/certs', { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('Access keys answered ' + res.status);
  const body = await res.json();
  const keys = (body && body.keys) || [];
  keyCache.set(team, { at: Date.now(), keys: keys });
  return keys;
}

/**
 * Verifies an Access token. Returns its claims (with .email) or throws.
 * opts: { teamDomain, audiences: [aud tags], fetchFn?, now? (seconds) }
 */
export async function verifyAccessJwt(token, opts) {
  const team = normalizeTeamDomain(opts.teamDomain);
  if (!team) throw new Error('ACCESS_TEAM_DOMAIN is not set or not valid');
  const audiences = (opts.audiences || []).filter(Boolean);
  if (!audiences.length) throw new Error('ACCESS_AUD is not set');
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('No Access token');
  const header = b64urlJson(parts[0]);
  const claims = b64urlJson(parts[1]);
  if (header.alg !== 'RS256') throw new Error('Unexpected token algorithm');

  const fetchFn = opts.fetchFn || fetch;
  let keys = await getKeys(team, fetchFn, false);
  let jwk = keys.find(function (k) { return k.kid === header.kid; });
  if (!jwk) {
    keys = await getKeys(team, fetchFn, true); // keys are rotated now and then
    jwk = keys.find(function (k) { return k.kid === header.kid; });
  }
  if (!jwk) throw new Error('Unknown token key');
  const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const signed = new TextEncoder().encode(parts[0] + '.' + parts[1]);
  const good = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(parts[2]), signed);
  if (!good) throw new Error('Bad token signature');

  const now = opts.now || Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== 'number' || claims.exp < now - 30) throw new Error('Token expired');
  if (typeof claims.nbf === 'number' && claims.nbf > now + 30) throw new Error('Token not valid yet');
  if (claims.iss !== 'https://' + team) throw new Error('Token from another team');
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.some(function (a) { return audiences.indexOf(a) >= 0; })) throw new Error('Token for another application');
  return claims;
}

// For tests.
export function clearAccessKeyCache() {
  keyCache.clear();
}
