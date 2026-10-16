// POST /api/admin/tickets/GC-1001/notes { body }: a private note in the ticket's history. Never emailed.

import { adminRoute } from '../../../../../lib/admin.js';
import { fail, json, readJson } from '../../../../../lib/http.js';
import { parseTicketNumber, ticketNumber } from '../../../../../lib/forms.js';
import { addEvent, getTicket, getTicketDetail } from '../../../../../lib/tickets.js';

export const onRequestPost = adminRoute(async function ({ request, env, params }, admin) {
  const id = parseTicketNumber(params.id);
  if (id == null) return fail(404, 'No such ticket.');
  const body = await readJson(request, 40000);
  if (body instanceof Response) return body;
  const text = typeof body.body === 'string' ? body.body.replace(/\r\n?/g, '\n').trim() : '';
  if (!text) return fail(400, 'Write the note first.');
  if (text.length > 20000) return fail(400, 'Please keep a note under 20,000 characters.');
  if (!(await getTicket(env.DB, id))) return fail(404, 'No ticket ' + ticketNumber(id) + '.');
  await addEvent(env.DB, id, admin.email, 'note', text, {});
  return json(await getTicketDetail(env.DB, id));
});
