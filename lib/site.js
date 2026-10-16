// The support site's one address. Cloudflare also serves the project on grid-central-support.pages.dev and on a
// <hash>.grid-central-support.pages.dev address for every deployment; Access doesn't cover those, so
// functions/_middleware.js forwards them here, and emails always link here.

export const SITE_HOST = 'support.getgridcentral.com';
export const SITE_URL = 'https://' + SITE_HOST;

// npx wrangler pages dev. Cloudflare never routes a request for these names to the real site.
export function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}
