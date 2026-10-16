// Small helpers for JSON responses from the Pages Functions.

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin'
};

export function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({}, BASE_HEADERS, extraHeaders || {})
  });
}

export function fail(status, message, extra) {
  return json(Object.assign({ ok: false, error: message }, extra || {}), status);
}

// Wraps a handler so an unexpected error becomes a plain 500 answer instead of Cloudflare's error page.
export function guarded(handler) {
  return async function (context) {
    try {
      return await handler(context);
    } catch (err) {
      console.error('Unhandled error', err && err.stack ? err.stack : err);
      return fail(500, 'Something went wrong on our side. Please try again in a minute.');
    }
  };
}

// Reads a JSON request body of up to maxBytes. Returns the value, or a Response to send back.
export async function readJson(request, maxBytes) {
  const type = request.headers.get('Content-Type') || '';
  if (!/^application\/json\b/i.test(type)) return fail(415, 'Send JSON.');
  const text = await request.text();
  if (text.length > (maxBytes || 65536)) return fail(413, 'That is too long.');
  try {
    return JSON.parse(text);
  } catch (e) {
    return fail(400, 'The request could not be read.');
  }
}

export function nowIso() {
  return new Date().toISOString();
}

// Splits a comma, semicolon or space separated list of email addresses into lower-case entries.
export function emailList(text) {
  return String(text || '').split(/[\s,;]+/).map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
}
