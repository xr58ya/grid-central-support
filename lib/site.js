// The support site's two addresses, both served by the one Pages project:
//   help.gridcentral.store   the public pages (home, report form, training guide at /guide) and the
//                            form's API (/api/tickets, /api/config)
//   admin.gridcentral.store  the admin (its page at /, its API at /api/admin/*), behind Cloudflare Access
// The rest of gridcentral.store isn't ours: the root domain is the public website and api.gridcentral.store the
// payments server, both looked after by development.
//
// Cloudflare also serves the project on grid-central-support.pages.dev and on a <hash>.grid-central-support.pages.dev
// address for every deployment; Access doesn't cover those, so functions/_middleware.js forwards them, and emails
// always link to the two addresses above.

export const HELP_HOST = 'help.gridcentral.store';
export const HELP_URL = 'https://' + HELP_HOST;
export const ADMIN_HOST = 'admin.gridcentral.store';
export const ADMIN_URL = 'https://' + ADMIN_HOST;

// Grid Central has one privacy policy, on the website (development's), with a section on support. The help desk's
// pages link to it, and help.gridcentral.store/privacy forwards to it.
export const PRIVACY_URL = 'https://gridcentral.store/privacy';

// Where the admin's page lives among the static files (dist/admin/). On the admin address it's served at /.
export const ADMIN_ASSET_DIR = '/admin/';

// The admin page's headers (the same as the /admin rules in _headers, which don't reach a page a function serves).
export const ADMIN_PAGE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' blob: data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; object-src 'none'"
};

// A ticket in the admin, for the owner's email.
export function adminTicketUrl(number) {
  return ADMIN_URL + '/#/' + number;
}

// npx wrangler pages dev. Cloudflare never routes a request for these names to the real site.
export function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}
