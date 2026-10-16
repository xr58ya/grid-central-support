// POST /api/tickets: the report form sends a ticket here.
//
// Order matters: the answers and files are checked first, then the Turnstile token, then the ticket is stored,
// then the files, and only then are emails sent (after the answer has gone back). A failed email or file is
// written in the ticket's history; it never loses the ticket.
//
// The request is multipart/form-data with:
//   payload    JSON: { type: "bug" | "feature" | "help", email, answers: { fieldId: text or [picks] } }
//   turnstile  the Turnstile token
//   files      0 to 5 attachments

import { ticketNumber } from '../../lib/forms.js';
import { fail, guarded, json } from '../../lib/http.js';
import { FILE_LIMITS, checkFile, checkFileSet, validateSubmission } from '../../lib/validate.js';
import { verifyTurnstile } from '../../lib/turnstile.js';
import { addEvent, addFile, createTicket, recentCounts } from '../../lib/tickets.js';
import { randomId, storageKey } from '../../lib/files.js';
import { PUBLIC_SUPPORT_EMAIL, ackEmail, ownerEmail, sendEmail } from '../../lib/email.js';

const MAX_BODY_BYTES = FILE_LIMITS.maxTotalBytes + 1024 * 1024;
const MAX_PAYLOAD_CHARS = 120000;
const PER_ADDRESS_PER_HOUR = 5;
const ALL_PER_HOUR = 60;

export const onRequestPost = guarded(async function (context) {
  const request = context.request;
  const env = context.env;
  if (!env.DB || !env.TURNSTILE_SECRET) {
    return fail(503, 'Sending isn\'t switched on yet. Please email ' + PUBLIC_SUPPORT_EMAIL + ' instead.');
  }
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) {
    return fail(413, 'That\'s too much to send at once. Attach smaller files, or fewer of them.', { fields: { files: 'The files are too big.' } });
  }
  if (!/^multipart\/form-data/i.test(request.headers.get('Content-Type') || '')) return fail(415, 'The form could not be read.');

  let form;
  try { form = await request.formData(); } catch (e) { return fail(400, 'The form could not be read.'); }

  const rawPayload = form.get('payload');
  if (typeof rawPayload !== 'string' || rawPayload.length > MAX_PAYLOAD_CHARS) return fail(400, 'The form could not be read.');
  let payload;
  try { payload = JSON.parse(rawPayload); } catch (e) { return fail(400, 'The form could not be read.'); }
  const checked = validateSubmission(payload);
  if (!checked.ok) return fail(400, checked.message, { fields: checked.errors });

  // Attachments: checked by name, size and first bytes before anything is stored.
  const uploads = form.getAll('files').filter(function (f) { return f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.size > 0; });
  const setError = checkFileSet(uploads);
  if (setError) return fail(400, setError, { fields: { files: setError } });
  if (uploads.length && !env.FILES) {
    const msg = 'Attachments aren\'t switched on yet. Remove them and send again, or email them to ' + PUBLIC_SUPPORT_EMAIL + '.';
    return fail(400, msg, { fields: { files: msg } });
  }
  const accepted = [];
  for (const file of uploads) {
    const head = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
    const r = checkFile(file.name, file.size, head);
    if (!r.ok) return fail(400, r.error, { fields: { files: r.error } });
    accepted.push({ file: file, name: r.name, kind: r.kind, contentType: r.contentType });
  }

  const human = await verifyTurnstile(env, form.get('turnstile'), request.headers.get('CF-Connecting-IP'));
  if (!human.ok) {
    console.warn('Turnstile refused:', human.reason);
    return fail(403, 'The "are you human" check didn\'t go through. Please do it again and press Send.', { retryCheck: true });
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const counts = await recentCounts(env.DB, hourAgo, checked.value.email);
  if (counts.mine >= PER_ADDRESS_PER_HOUR) {
    return fail(429, 'You\'ve sent several tickets in the last hour. Please wait a little, or reply to one of our emails instead.');
  }
  if (counts.total >= ALL_PER_HOUR) {
    return fail(429, 'We\'re getting a lot of tickets right now. Please try again later, or email ' + PUBLIC_SUPPORT_EMAIL + '.');
  }

  const id = await createTicket(env.DB, checked.value);
  const number = ticketNumber(id);

  const stored = [];
  const warnings = [];
  for (const a of accepted) {
    const fileId = randomId();
    const key = storageKey(id, fileId, a.name);
    try {
      await env.FILES.put(key, a.file, { httpMetadata: { contentType: a.contentType }, customMetadata: { ticket: number } });
      await addFile(env.DB, id, { id: fileId, key: key, filename: a.name, contentType: a.contentType, kind: a.kind, size: a.file.size });
      stored.push({ filename: a.name, size: a.file.size });
    } catch (err) {
      console.error('Attachment not stored for ' + number, err && err.message);
      warnings.push(a.name + ' couldn\'t be saved. Please email it to ' + PUBLIC_SUPPORT_EMAIL + ' with your ticket number.');
      try { await addEvent(env.DB, id, 'system', 'file', null, { ok: false, filename: a.name, error: 'Upload failed' }); } catch (e) { /* the ticket is stored */ }
    }
  }

  const ticket = Object.assign({ id: id }, checked.value);
  context.waitUntil(sendNewTicketEmails(env, ticket, stored, new URL(request.url).origin));
  return json({ ok: true, ticket: number, files: stored.length, warnings: warnings }, 201);
});

// Acknowledgement to the customer and a heads-up to the owner. Each result goes in the ticket's history.
async function sendNewTicketEmails(env, ticket, files, siteUrl) {
  const jobs = [{ to: 'customer', purpose: 'acknowledgement', msg: ackEmail(ticket, siteUrl) }];
  jobs.push({ to: 'owner', purpose: 'new ticket', msg: env.OWNER_EMAIL ? ownerEmail(env, ticket, files, siteUrl) : null });
  for (const job of jobs) {
    const r = job.msg ? await sendEmail(env, job.msg) : { ok: false, error: 'OWNER_EMAIL isn\'t set.' };
    if (!r.ok) console.error('Email to ' + job.to + ' for ' + ticketNumber(ticket.id) + ' failed: ' + r.error);
    try {
      await addEvent(env.DB, ticket.id, 'system', 'email', null, { to: job.to, purpose: job.purpose, ok: r.ok, error: r.ok ? undefined : r.error });
    } catch (e) {
      console.error('Could not log the email for ' + ticketNumber(ticket.id), e && e.message);
    }
  }
}
