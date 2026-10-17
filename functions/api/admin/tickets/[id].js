// /api/admin/tickets/GC-1001
//   GET     the ticket, its answers, files and history
//   PATCH   { status?, priority?, notify?: true, message?, from?: { status, priority } }: change status or
//           priority (send only what changed); with notify, email the customer about the new status (and the
//           optional message). from is what the page showed: if the ticket has changed since, nothing is saved (409).
//   DELETE  { confirm: "GC-1001" }: delete the ticket, its history and its files (for "please delete my data")

import { adminRoute } from '../../../../lib/admin.js';
import { fail, json, readJson } from '../../../../lib/http.js';
import { PRIORITY_IDS, STATUS_IDS, parseTicketNumber, statusLabel, ticketNumber } from '../../../../lib/forms.js';
import { addEvents, deleteTicket, getTicket, getTicketDetail } from '../../../../lib/tickets.js';
import { deleteTicketFiles } from '../../../../lib/files.js';
import { sendEmail, statusEmail } from '../../../../lib/email.js';

const CHANGED_ELSEWHERE = 'This ticket was changed somewhere else (another tab, or another admin). Reload it to see the change, then try again.';

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

  // A field being changed must still be what the page showed; the other one is left alone either way.
  const from = body.from && typeof body.from === 'object' ? body.from : {};
  if ((body.status != null && from.status != null && from.status !== ticket.status) ||
      (body.priority != null && from.priority != null && from.priority !== ticket.priority)) {
    return fail(409, CHANGED_ELSEWHERE);
  }

  const status = body.status == null ? ticket.status : body.status;
  const priority = body.priority == null ? ticket.priority : body.priority;
  if (STATUS_IDS.indexOf(status) < 0) return fail(400, 'Unknown status.');
  if (PRIORITY_IDS.indexOf(priority) < 0) return fail(400, 'Unknown priority.');
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 20000) : '';
  const statusChanged = status !== ticket.status;
  const priorityChanged = priority !== ticket.priority;
  if (!statusChanged && !priorityChanged) return fail(400, 'Nothing changed.');

  // Only if it's still as read just now, so two saves at the same moment can't undo each other.
  const upd = await env.DB.prepare('UPDATE tickets SET status = ?, priority = ? WHERE id = ? AND status = ? AND priority = ?')
    .bind(status, priority, id, ticket.status, ticket.priority).run();
  if (upd && upd.meta && upd.meta.changes === 0) return fail(409, CHANGED_ELSEWHERE);

  let emailResult = null;
  const events = [];
  if (statusChanged) {
    const notify = body.notify === true;
    if (notify) emailResult = await sendEmail(env, statusEmail(ticket, status, message));
    events.push({ actor: admin.email, kind: 'status', body: notify && message ? message : null, meta: {
      from: ticket.status, to: status, notified: notify, ok: emailResult ? emailResult.ok : undefined,
      error: emailResult && !emailResult.ok ? emailResult.error : undefined
    } });
  }
  if (priorityChanged) events.push({ actor: admin.email, kind: 'priority', meta: { from: ticket.priority, to: priority } });
  await addEvents(env.DB, id, events);

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
  // Files first: if storage fails, the ticket stays as it is so the delete can be tried again.
  if (env.FILES) {
    try {
      await deleteTicketFiles(env.FILES, id);
    } catch (e) {
      console.error('R2 delete failed for ' + ticketNumber(id), e && e.message);
      return fail(502, 'The files of ' + ticketNumber(id) + ' couldn\'t be deleted from storage, so nothing was deleted. Please try again in a minute.');
    }
  } else if (await env.DB.prepare('SELECT COUNT(*) AS n FROM ticket_files WHERE ticket_id = ?').bind(id).first('n')) {
    return fail(503, 'File storage isn\'t set up (FILES binding), so the files of ' + ticketNumber(id) + ' can\'t be deleted. Nothing was deleted.');
  }
  await deleteTicket(env.DB, id);
  console.log('Deleted ' + ticketNumber(id));
  return json({ ok: true, deleted: ticketNumber(id) });
});
