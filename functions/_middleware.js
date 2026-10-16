// Runs before every request. The site only works on support.getgridcentral.com (and localhost for wrangler dev):
// the *.pages.dev addresses Cloudflare also gives the project have no Access lock in front of them, so pages
// there forward to the real address and the API there answers "not found".

import { SITE_HOST, SITE_URL, isLocalHost } from '../lib/site.js';
import { fail } from '../lib/http.js';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === SITE_HOST || isLocalHost(url.hostname)) return context.next();
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return fail(404, 'Not found.');
  return Response.redirect(SITE_URL + url.pathname + url.search, 301);
}
