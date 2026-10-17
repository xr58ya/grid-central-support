// GET /api/config: what the report form needs to know before it can send (the Turnstile site key, which is
// public, and the attachment limits). "sending" is false until the site is fully set up.

import { json } from '../../lib/http.js';
import { FILE_LIMITS, ACCEPTED_EXTENSIONS } from '../../lib/validate.js';

export async function onRequestGet({ env }) {
  const ready = Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET && env.DB);
  return json({
    sending: ready,
    turnstileSiteKey: ready ? env.TURNSTILE_SITE_KEY : null,
    files: ready && env.FILES ? {
      maxFiles: FILE_LIMITS.maxFiles,
      maxFileBytes: FILE_LIMITS.maxFileBytes,
      maxTotalBytes: FILE_LIMITS.maxTotalBytes,
      accept: ACCEPTED_EXTENSIONS
    } : null
  });
}
