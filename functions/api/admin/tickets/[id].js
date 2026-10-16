// /api/admin/tickets/GC-1001
//   GET     the ticket, its answers, files and history
//   PATCH   { status?, priority?, notify?: true, message? }: change status or priority; with notify, email the
//           customer about the new status (and the optional message)
//   DELETE  { confirm: "GC-1001" }: delete the ticket, its history and its files (for "please delete my data")

import { adminRoute } from '../../../../lib/admin.js';
import { fail, json, readJson } from '../../../../lib/http.js';
import { PRIORITY_IDS, STATUS_IDS, parseTicketNumber, statusLabel, ticketNumber } from '../../../../lib/forms.js';
import { addEvent, deleteTicket, getTicket, getTicketDetail } from '../../../../lib/tickets.js';
import { sendEmail, statusEmail } from '../../../../lib/email.js';

async function detail(env, id) {
  const d = await getTicketDetail(env.DB, id);
  return d ? json(d) : fail(404, 'No ticket ' + ticketNumber(id) + '.');
}

export const onRequestGet = adminRoute(async function ({ env, params }) {
  const id = parseTicketNumber(params.id);
  if (id == null) return fail(404, 'No such ticket.');
  return detail(env, id);
});

export const onRequestPatch = adminRoute(async function ({ request, env, params }, admin) {
  const id = parseTicketNumber(params.id);
  if (id == null) return fail(404, 'No such ticket.');
  const body = await readJson(request, 40000);
  if (body instanceof Response) return body;
  const ticket = await getTicket(env.DB, id);
  if (!ticket) return fail(404, 'No ticket ' + ticketNumber(id) + '.');

  const status = body.status == null ? ticket.status : body.status;
  const priority = body.priority == null ? ticket.priority : body.priority;
  if (STATUS_IDS.indexOf(status) < 0) return fail(400, 'Unknown status.');
  if (PRIORITY_IDS.indexOf(priority) < 0) return fail(400, 'Unknown priority.');
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 20000) : '';
  const statusChanged = status !== ticket.status;
  const priorityChanged = priority !== ticket.priority;
  if (!statusChanged && !priorityChanged) return fail(400, 'Nothing changed.');

  await env.DB.prepare('UPDATE tickets SET status = ?, priority = ? WHERE id = ?').bind(status, priority, id).run();
  let emailResult = null;
  if (statusChanged) {
    const notify = body.notify === true;
    if (notify) emailResult = await sendEmail(env, statusEmail(ticket, status, message));
    await addEvent(env.DB, id, admin.email, 'status', notify && message ? message : null, {
      from: ticket.status, to: status, notified: notify, ok: emailResult ? emailResult.ok : undefined,
      error: emailResult && !emailResult.ok ? emailResult.error : undefined
    });
  }
  if (priorityChanged) await addEvent(env.DB, id, admin.email, 'priority', null, { from: ticket.priority, to: priority });

  const out = await getTicketDetail(env.DB, id);
  if (emailResult && !emailResult.ok) {
    out.warning = 'Status changed to ' + statusLabel(status) + ', but the email to the customer failed: ' + emailResult.error;
  }
  return json(out);
});

export const onRequestDelete = adminRoute(async function ({ request, env, params }) {
  const id = parseTicketNumber(params.id);
  if (id == null) return fail(404, 'No such ticket.');
  const body = await readJson(request, 1000);
  if (body instanceof Response) return body;
  if (parseTicketNumber(body.confirm) !== id) return fail(400, 'Type the ticket number to confirm.');
  const ticket = await getTicket(env.DB, id);
  if (!ticket) return fail(404, 'No ticket ' + ticketNumber(id) + '.');
  const keys = await deleteTicket(env.DB, id);
  let filesLeft = 0;
  if (keys.length && env.FILES) {
    try { await env.FILES.delete(keys); } catch (e) { filesLeft = keys.length; console.error('R2 delete failed for ' + ticketNumber(id), e && e.message); }
  }
  console.log('Deleted ' + ticketNumber(id));
  return json({ ok: true, deleted: ticketNumber(id), filesLeft: filesLeft });
});
