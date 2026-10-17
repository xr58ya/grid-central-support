// Runs before every /api/admin/* function: no admin sign-in, no answer. Each function checks again itself.

import { requireAdmin } from '../../../lib/admin.js';
import { guarded } from '../../../lib/http.js';

export const onRequest = guarded(async function (context) {
  const admin = await requireAdmin(context.request, context.env);
  if (admin instanceof Response) return admin;
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store');
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
});
