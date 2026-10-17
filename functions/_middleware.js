// Runs before every request. One Pages project answers on two addresses (lib/site.js):
//   help.gridcentral.store   public pages and /api/tickets, /api/config. /admin forwards to the admin address,
//                            /api/admin/* answers "not found".
//   admin.gridcentral.store  the admin page at / and /api/admin/*. Public pages forward to the help address, the rest
//                            of /api answers "not found".
// Any other address (the *.pages.dev ones Cloudflare also gives the project, which have no Access lock in front of
// them) forwards pages to the right address and answers "not found" for the whole API.
// localhost (npx wrangler pages dev) serves everything as it is, the admin at /admin/.

import { ADMIN_ASSET_DIR, ADMIN_HOST, ADMIN_PAGE_HEADERS, ADMIN_URL, HELP_HOST, HELP_URL, isLocalHost } from '../lib/site.js';
import { fail } from '../lib/http.js';

function under(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

// /admin, /admin/ and /admin/index.html are the admin page, which is / on the admin address. Its other files
// (/admin/admin.js and so on) keep their paths.
function isAdminPage(pathname) {
  return pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html';
}

function toAdmin(url) {
  return ADMIN_URL + (isAdminPage(url.pathname) ? '/' : url.pathname) + url.search;
}

// The certificate check (/.well-known/acme-challenge/...) must reach Cloudflare on the address it was asked for.
function isWellKnown(pathname) {
  return under(pathname, '/.well-known');
}

async function adminPage(context, url) {
  const res = await context.env.ASSETS.fetch(new Request(new URL(ADMIN_ASSET_DIR, url).toString(), context.request));
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(ADMIN_PAGE_HEADERS)) out.headers.set(k, v);
  return out;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const p = url.pathname;
  if (isLocalHost(url.hostname) || isWellKnown(p)) return context.next();

  if (url.hostname === ADMIN_HOST) {
    if (p === '/') return adminPage(context, url);
    if (under(p, '/api/admin')) return context.next();
    if (under(p, '/api')) return fail(404, 'Not found.');
    if (isAdminPage(p)) return Response.redirect(ADMIN_URL + '/' + url.search, 301);
    if (under(p, '/admin')) return context.next();
    return Response.redirect(HELP_URL + p + url.search, 302);
  }

  if (url.hostname === HELP_HOST) {
    if (under(p, '/api/admin')) return fail(404, 'Not found.');
    if (under(p, '/admin')) return Response.redirect(toAdmin(url), 302);
    return context.next();
  }

  if (under(p, '/api')) return fail(404, 'Not found.');
  if (under(p, '/admin')) return Response.redirect(toAdmin(url), 301);
  return Response.redirect(HELP_URL + p + url.search, 301);
}
