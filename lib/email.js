// Emails, sent through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
// Plain text only. A failed email never throws: the caller logs the result in the ticket's history.

import { FORMS, STATUSES, answersAsText, ticketNumber } from './forms.js';
import { emailList } from './http.js';

const RESEND_URL = 'https://api.resend.com/emails';
const USER_AGENT = 'grid-central-support/1.0';
export const DEFAULT_FROM = 'Grid Central Support <support@gridcentral.store>';
export const DEFAULT_REPLY_TO = 'support@gridcentral.store';
export const PUBLIC_SUPPORT_EMAIL = 'support.gridcentral@gmail.com';

const NEVER_SEND = 'Please never send passwords, payment details or your iRacing login.';
const SIGN_OFF = 'Grid Central Support';

function oneLine(text, max) {
  const s = String(text || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/** Sends one email (msg.to: an address or a list of them). Returns { ok: true, id } or { ok: false, error }. */
export async function sendEmail(env, msg) {
  if (!env.RESEND_API_KEY) return { ok: false, error: 'Email isn\'t set up (RESEND_API_KEY is missing).' };
  const to = [].concat(msg.to || []).filter(Boolean);
  if (!to.length) return { ok: false, error: 'No address to send to.' };
  // Resend refuses (403) any request without a User-Agent, and fetch in Cloudflare Functions doesn't add one.
  const headers = { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json', 'User-Agent': USER_AGENT };
  const body = {
    from: env.MAIL_FROM || DEFAULT_FROM,
    to: to,
    subject: oneLine(msg.subject, 180),
    text: msg.text
  };
  const replyTo = msg.replyTo === undefined ? (env.MAIL_REPLY_TO || DEFAULT_REPLY_TO) : msg.replyTo;
  if (replyTo) body.reply_to = replyTo;
  try {
    const res = await fetch(RESEND_URL, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: 'Resend answered ' + res.status + ': ' + oneLine(text, 300) };
    let id = null;
    try { id = JSON.parse(text).id || null; } catch (e) { /* the email still went */ }
    return { ok: true, id: id };
  } catch (err) {
    return { ok: false, error: 'Could not reach Resend: ' + oneLine(err && err.message, 200) };
  }
}

function kindWords(type) {
  if (type === 'feature') return { thing: 'idea', thanks: 'Thanks for your idea' };
  if (type === 'help') return { thing: 'question', thanks: 'Thanks for getting in touch' };
  return { thing: 'report', thanks: 'Thanks for reporting a problem' };
}

// To the customer, straight after they send the form. It deliberately repeats none of their answers, so the
// form can't be used to send someone else an email with words of the sender's choosing.
export function ackEmail(ticket, siteUrl) {
  const n = ticketNumber(ticket.id);
  const w = kindWords(ticket.type);
  return {
    to: ticket.email,
    subject: '[' + n + '] We\'ve got your ' + w.thing,
    text: [
      'Hi,',
      '',
      w.thanks + '. Your ticket number is ' + n + '.',
      '',
      'We\'ve got your ' + w.thing + ' and will reply to this email address. To add anything, reply to this email and keep ' + n + ' in the subject.',
      '',
      NEVER_SEND,
      '',
      'If you didn\'t send this, you can ignore this email.',
      '',
      SIGN_OFF,
      siteUrl || ''
    ].join('\n').trim()
  };
}

// To the owner (OWNER_EMAIL, one address or several separated by commas): everything in the ticket, and a link
// to it in the admin (adminLink(number), for example https://admin.gridcentral.store/#/GC-1001). Replying to this email goes back to the support address, not to the customer, so it says to
// answer from the admin, where the reply is sent from the support address and kept in the ticket's history.
export function ownerEmail(env, ticket, files, adminLink) {
  const n = ticketNumber(ticket.id);
  const spec = FORMS[ticket.type];
  const answers = answersAsText(ticket.type, ticket.answers, { skip: ['summary'] });
  const fileLines = (files || []).map(function (f) { return '- ' + f.filename + ' (' + Math.ceil(f.size / 1024) + ' KB)'; });
  const link = adminLink ? adminLink(n) : n;
  return {
    to: emailList(env.OWNER_EMAIL),
    subject: '[' + n + '] New ' + spec.name.toLowerCase() + ': ' + oneLine(ticket.summary, 100) + (ticket.version ? ' (' + ticket.version + ')' : ''),
    replyTo: null,
    text: [
      'Answer in the admin: ' + link,
      '(Replying to this email doesn\'t reach the customer.)',
      '',
      n + ' · ' + spec.name,
      'From: ' + ticket.email,
      'Summary: ' + ticket.summary,
      '',
      answers,
      '',
      fileLines.length ? 'Files (private, open them in the admin):\n' + fileLines.join('\n') : 'No files attached.'
    ].join('\n')
  };
}

// To the customer: a reply typed in the admin.
export function replyEmail(ticket, body) {
  const n = ticketNumber(ticket.id);
  return {
    to: ticket.email,
    subject: 'Re: [' + n + '] ' + oneLine(ticket.summary, 120),
    text: [
      String(body).trim(),
      '',
      '--',
      SIGN_OFF + ' · Ticket ' + n,
      'Reply to this email to answer. ' + NEVER_SEND
    ].join('\n')
  };
}

// To the customer: the ticket's status changed (only when the admin ticks "email the customer").
export function statusEmail(ticket, statusId, message) {
  const n = ticketNumber(ticket.id);
  const s = STATUSES.find(function (x) { return x.id === statusId; });
  const label = s ? s.label : statusId;
  const lines = [
    'Hi,',
    '',
    'There\'s an update on your ticket ' + n + ' (' + oneLine(ticket.summary, 120) + ').',
    '',
    'Status: ' + (s ? s.customer : label)
  ];
  if (message && String(message).trim()) lines.push('', String(message).trim());
  lines.push('', 'Reply to this email if you have anything to add. ' + NEVER_SEND, '', SIGN_OFF);
  return { to: ticket.email, subject: '[' + n + '] Update: ' + label, text: lines.join('\n') };
}
