// Attachments in R2 (binding FILES). The bucket is private: files are only read back through
// /api/admin/files/<id>, which needs an admin sign-in.

import { ticketNumber } from './forms.js';

export function randomId() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, function (x) { return x.toString(16).padStart(2, '0'); }).join('');
}

export function storageKey(ticketId, fileId, name) {
  return 'tickets/' + ticketNumber(ticketId) + '/' + fileId + '/' + name;
}

/**
 * Removes every file of a ticket from R2: everything stored under tickets/GC-<id>/, so a file whose database row
 * was never written goes too. Throws if R2 fails.
 */
export async function deleteTicketFiles(bucket, ticketId) {
  const prefix = 'tickets/' + ticketNumber(ticketId) + '/';
  let cursor;
  do {
    const page = await bucket.list({ prefix: prefix, cursor: cursor });
    const keys = (page.objects || []).map(function (o) { return o.key; });
    if (keys.length) await bucket.delete(keys);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
}

// A Content-Disposition value with a plain fallback name and the UTF-8 name.
export function contentDisposition(kind, name) {
  const plain = String(name).replace(/[^\w.\-]+/g, '_');
  return kind + '; filename="' + plain + '"; filename*=UTF-8\'\'' + encodeURIComponent(name);
}

// Words that usually mark a line worth showing a developer.
const ERROR_LINE = /\b(error|errors|exception|traceback|fatal|failed|failure|crash(ed)?|unhandled|critical|panic|denied|refused|timed? ?out)\b/i;

/**
 * Picks the lines that look like errors from a log's text: the last `max` of them, each cut to 400 characters,
 * plus the following line when it continues a stack trace.
 */
export function errorLines(text, max) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const picked = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!ERROR_LINE.test(line)) continue;
    picked.push(line.slice(0, 400));
    let j = i + 1;
    while (j < lines.length && j <= i + 3 && /^\s+(at |File "|\.\.\.)/.test(lines[j])) {
      picked.push(lines[j].slice(0, 400));
      j++;
    }
    i = j - 1;
  }
  return picked.slice(-(max || 40));
}

export function decodeText(bytes, contentType) {
  const utf16 = /utf-16/i.test(contentType || '');
  if (utf16 && bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
  return new TextDecoder(utf16 ? 'utf-16le' : 'utf-8').decode(bytes);
}
