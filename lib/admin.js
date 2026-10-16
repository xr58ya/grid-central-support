// Who may use /api/admin/*. Cloudflare Access sits in front of /admin and /api/admin, and every admin function
// checks again here: the signed Access token must be valid for this team (ACCESS_TEAM_DOMAIN) and application
// (ACCESS_AUD), and the email in it must be on ADMIN_EMAILS. Anything missing means no entry.
//
// The token is checked before anything else about the person, and the email comes from inside it: the plain
// Cf-Access-Authenticated-User-Email header can be typed by anyone where Access isn't in front, so until the token
// is good every refusal is the same, whatever address was claimed.

import { verifyAccessJwt } from './access.js';
import { emailList, fail, guarded } from './http.js';
import { isLocalHost } from './site.js';

async function signedInEmail(request, env, allowed) {
  const url = new URL(request.url);

  // Local testing only (npx wrangler pages dev with LOCAL_DEV_ADMIN in .dev.vars): Cloudflare never routes
  // a request for localhost to the real site, so this can't open the live admin.
  if (env.LOCAL_DEV_ADMIN && isLocalHost(url.hostname)) {
    const dev = String(env.LOCAL_DEV_ADMIN).trim().toLowerCase();
    return allowed.indexOf(dev) >= 0 ? dev : fail(403, 'LOCAL_DEV_ADMIN isn\'t on ADMIN_EMAILS.');
  }

  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return fail(403, 'The admin isn\'t set up yet (ACCESS_TEAM_DOMAIN or ACCESS_AUD is missing).');
  }
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return fail(401, 'Sign in through Cloudflare Access first.');
  let claims;
  try {
    claims = await verifyAccessJwt(token, {
      teamDomain: env.ACCESS_TEAM_DOMAIN,
      audiences: String(env.ACCESS_AUD).split(/[\s,]+/)
    });
  } catch (err) {
    console.warn('Admin request refused:', err && err.message);
    return fail(403, 'Your Cloudflare Access sign-in couldn\'t be checked. Reload the page to sign in again.');
  }
  const email = String(claims.email || '').trim().toLowerCase();
  if (!email) {
    console.warn('Admin request refused: the Access token has no email');
    return fail(403, 'Your Cloudflare Access sign-in couldn\'t be checked. Reload the page to sign in again.');
  }
  const header = String(request.headers.get('Cf-Access-Authenticated-User-Email') || '').trim().toLowerCase();
  if (header && header !== email) return fail(403, 'Your Cloudflare Access sign-in doesn\'t match.');
  if (allowed.indexOf(email) < 0) return fail(403, 'This account isn\'t allowed to use the admin.');
  return email;
}

/** Returns { email } for an allowed admin, or a Response to send back. */
export async function requireAdmin(request, env) {
  const allowed = emailList(env.ADMIN_EMAILS);
  if (!allowed.length) return fail(403, 'The admin isn\'t set up yet (ADMIN_EMAILS is missing).');
  const email = await signedInEmail(request, env, allowed);
  if (email instanceof Response) return email;

  // Changes must come from the admin page itself, not another site (the Access cookie goes with any request).
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('Origin');
    if (!origin || origin !== new URL(request.url).origin) return fail(403, 'Changes can only be made from the admin page.');
  }
  return { email: email };
}

/** Wraps an admin handler: (context, admin) => Response. */
export function adminRoute(handler) {
  return guarded(async function (context) {
    const admin = await requireAdmin(context.request, context.env);
    if (admin instanceof Response) return admin;
    return handler(context, admin);
  });
}
