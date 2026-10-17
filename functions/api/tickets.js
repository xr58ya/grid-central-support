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
import { emailList, fail, guarded, json } from '../../lib/http.js';
import { FILE_LIMITS, checkFile, checkFileSet, validateSubmission } from '../../lib/validate.js';
import { verifyTurnstile } from '../../lib/turnstile.js';
import { addEvent, addFile, createTicket, deleteTicket, sendLimit } from '../../lib/tickets.js';
import { randomId, storageKey } from '../../lib/files.js';
import { PUBLIC_SUPPORT_EMAIL, ackEmail, ownerEmail, sendEmail } from '../../lib/email.js';
import { HELP_HOST, HELP_URL, adminTicketUrl, isLocalHost } from '../../lib/site.js';

const MAX_BODY_BYTES = FILE_LIMITS.maxTotalBytes + 1024 * 1024;
const MAX_PAYLOAD_CHARS = 120000;

const TOO_BIG = 'That\'s too much to send at once. Attach smaller files, or fewer of them.';
const TOO_LONG = 'Your answers are too long to send. If you pasted companion.log, attach it as a file instead.';
const LIMIT_MESSAGES = {
  address: 'You\'ve sent several tickets in the last hour. Please wait a little, or reply to one of our emails instead.',
  hour: 'We\'re getting a lot of tickets right now. Please try again later, or email ' + PUBLIC_SUPPORT_EMAIL + '.',
  day: 'We\'ve had a lot of tickets today. Please try again tomorrow, or email ' + PUBLIC_SUPPORT_EMAIL + '.'
};

// The form, read with a size cap that doesn't depend on the Content-Length header (a chunked upload has none).
async function readForm(request) {
  if (!request.body) return {};
  let seen = 0;
  let tooBig = false;
  const counted = request.body.pipeThrough(new TransformStream({
    transform: function (chunk, controller) {
      seen += chunk.byteLength;
      if (seen > MAX_BODY_BYTES) { tooBig = true; controller.error(new Error('Request too big')); } else controller.enqueue(chunk);
    }
  }));
  try {
    return { form: await new Response(counted, { headers: { 'Content-Type': request.headers.get('Content-Type') } }).formData() };
  } catch (e) {
    return { tooBig: tooBig };
  }
}

export const onRequestPost = guarded(async function (context) {
  const request = context.request;
  const env = context.env;
  if (!env.DB || !env.TURNSTILE_SECRET) {
    return fail(503, 'Sending isn\'t switched on yet. Please email ' + PUBLIC_SUPPORT_EMAIL + ' instead.');
  }
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) {
    return fail(413, TOO_BIG, { fields: { files: 'The files are too big.' } });
  }
  if (!/^multipart\/form-data/i.test(request.headers.get('Content-Type') || '')) return fail(415, 'The form could not be read.');

  const read = await readForm(request);
  if (read.tooBig) return fail(413, TOO_BIG, { fields: { files: 'The files are too big.' } });
  if (!read.form) return fail(400, 'The form could not be read.');
  const form = read.form;

  const rawPayload = form.get('payload');
  if (typeof rawPayload !== 'string') return fail(400, 'The form could not be read.');
  // Mostly a whole companion.log pasted into the log box: say so, so the sender knows what to change.
  if (rawPayload.length > MAX_PAYLOAD_CHARS) return fail(400, TOO_LONG, { fields: { logs: 'This is too long: attach companion.log as a file instead.' } });
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

  // The check must have been done on the help address itself (any address works when testing on localhost).
  const local = isLocalHost(new URL(request.url).hostname);
  const human = await verifyTurnstile(env, form.get('turnstile'), request.headers.get('CF-Connecting-IP'), local ? null : HELP_HOST);
  if (!human.ok) {
    console.warn('Turnstile refused:', human.reason);
    if (human.retry) return fail(403, 'The "are you human" check didn\'t go through. Please do it again and press Send.', { retryCheck: true });
    // Not something the sender can fix (usually a setup problem): don't ask them to keep trying the check. The form
    // adds "try again in a minute, or press Copy my answers and email them".
    return fail(503, 'The "are you human" check couldn\'t be confirmed on our side.');
  }

  const email = checked.value.email;
  const limit = await sendLimit(env.DB, email);
  if (limit) return fail(429, LIMIT_MESSAGES[limit]);

  const id = await createTicket(env.DB, checked.value);
  const number = ticketNumber(id);
  // Checked again now the ticket is stored, so tickets sent at the same moment can't all slip under the limit.
  const over = await sendLimit(env.DB, email, { upToId: id });
  if (over) {
    await deleteTicket(env.DB, id);
    return fail(429, LIMIT_MESSAGES[over]);
  }

  const stored = [];
  const warnings = [];
  for (const a of accepted) {
    const fileId = randomId();
    const key = storageKey(id, fileId, a.name);
    let put = false;
    try {
      await env.FILES.put(key, a.file, { httpMetadata: { contentType: a.contentType }, customMetadata: { ticket: number } });
      put = true;
      await addFile(env.DB, id, { id: fileId, key: key, filename: a.name, contentType: a.contentType, kind: a.kind, size: a.file.size });
      stored.push({ filename: a.name, size: a.file.size });
    } catch (err) {
      console.error('Attachment not stored for ' + number, err && err.message);
      // The sender is told it wasn't saved, so don't keep a copy nothing in the admin points to.
      if (put) { try { await env.FILES.delete(key); } catch (e) { console.error('Could not remove ' + key, e && e.message); } }
      warnings.push(a.name + ' couldn\'t be saved. Please email it to ' + PUBLIC_SUPPORT_EMAIL + ' with your ticket number.');
      try { await addEvent(env.DB, id, 'system', 'file', null, { ok: false, filename: a.name, error: 'Upload failed' }); } catch (e) { /* the ticket is stored */ }
    }
  }

  const ticket = Object.assign({ id: id }, checked.value);
  context.waitUntil(sendNewTicketEmails(env, ticket, stored));
  return json({ ok: true, ticket: number, files: stored.length, warnings: warnings }, 201);
});

// Acknowledgement to the customer and a heads-up to the owner, sent at the same time (Cloudflare only waits about
// 30 seconds for this after the answer has gone back). Each result goes in the ticket's history.
// The customer's email links to the help address, the owner's to the ticket on the admin address.
async function sendNewTicketEmails(env, ticket, files) {
  const jobs = [{ to: 'customer', purpose: 'acknowledgement', msg: ackEmail(ticket, HELP_URL) }];
  jobs.push({ to: 'owner', purpose: 'new ticket', msg: emailList(env.OWNER_EMAIL).length ? ownerEmail(env, ticket, files, adminTicketUrl) : null });
  const results = await Promise.all(jobs.map(function (job) {
    return job.msg ? sendEmail(env, job.msg) : { ok: false, error: 'OWNER_EMAIL isn\'t set.' };
  }));
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const r = results[i];
    if (!r.ok) console.error('Email to ' + job.to + ' for ' + ticketNumber(ticket.id) + ' failed: ' + r.error);
    try {
      await addEvent(env.DB, ticket.id, 'system', 'email', null, { to: job.to, purpose: job.purpose, ok: r.ok, error: r.ok ? undefined : r.error });
    } catch (e) {
      console.error('Could not log the email for ' + ticketNumber(ticket.id), e && e.message);
    }
  }
}
