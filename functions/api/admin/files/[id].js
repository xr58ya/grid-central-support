// GET /api/admin/files/<file id>
//   (no options)      downloads the file
//   ?inline=1         shows a screenshot in the page (PNG, JPEG, GIF and WebP only)
//   ?lines=errors     for a log: { lines: [...] }, the lines that look like errors, from its last 1 MB
//
// Files are always sent with nosniff and a sandboxing Content-Security-Policy, so an uploaded file can never run
// as part of the site.

import { adminRoute } from '../../../../lib/admin.js';
import { fail, json } from '../../../../lib/http.js';
import { contentDisposition, decodeText, errorLines } from '../../../../lib/files.js';
import { getFile } from '../../../../lib/tickets.js';

const INLINE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const LOG_TAIL_BYTES = 1024 * 1024;

export const onRequestGet = adminRoute(async function ({ request, env, params }) {
  const fileId = String(params.id || '');
  if (!/^[0-9a-f]{32}$/.test(fileId)) return fail(404, 'No such file.');
  if (!env.FILES) return fail(503, 'File storage isn\'t set up (FILES binding).');
  const row = await getFile(env.DB, fileId);
  if (!row) return fail(404, 'No such file.');
  const p = new URL(request.url).searchParams;

  if (p.get('lines') === 'errors') {
    if (row.kind !== 'log') return fail(400, 'Only logs have lines.');
    const tail = Math.min(row.size, LOG_TAIL_BYTES) & ~1; // even, so UTF-16 text stays aligned
    const obj = await env.FILES.get(row.r2_key, { range: { suffix: tail } });
    if (!obj) return fail(404, 'The file is missing from storage.');
    const bytes = new Uint8Array(await obj.arrayBuffer());
    const lines = errorLines(decodeText(bytes, row.content_type), 40);
    return json({ filename: row.filename, partial: row.size > tail, lines: lines });
  }

  const obj = await env.FILES.get(row.r2_key);
  if (!obj) return fail(404, 'The file is missing from storage.');
  const inline = p.get('inline') === '1' && INLINE_TYPES.indexOf(row.content_type) >= 0;
  return new Response(obj.body, {
    headers: {
      'Content-Type': row.content_type,
      'Content-Disposition': contentDisposition(inline ? 'inline' : 'attachment', row.filename),
      'Content-Security-Policy': 'default-src \'none\'; img-src \'self\'; sandbox',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  });
});
