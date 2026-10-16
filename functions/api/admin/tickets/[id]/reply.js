// POST /api/admin/tickets/GC-1001/reply { body }: emails the customer and logs the reply in the history,
// marked sent or failed. A failed reply stays in the history so it can be copied and sent again.

import { adminRoute } from '../../../../../lib/admin.js';
import { fail, json, readJson } from '../../../../../lib/http.js';
import { parseTicketNumber, ticketNumber } from '../../../../../lib/forms.js';
import { addEvent, getTicket, getTicketDetail } from '../../../../../lib/tickets.js';
import { replyEmail, sendEmail } from '../../../../../lib/email.js';

export const onRequestPost = adminRoute(async function ({ request, env, params }, admin) {
  const id = parseTicketNumber(params.id);
  if (id == null) return fail(404, 'No such ticket.');
  const body = await readJson(request, 60000);
  if (body instanceof Response) return body;
  const text = typeof body.body === 'string' ? body.body.replace(/\r\n?/g, '\n').trim() : '';
  if (!text) return fail(400, 'Write the reply first.');
  if (text.length > 20000) return fail(400, 'Please keep a reply under 20,000 characters.');
  const ticket = await getTicket(env.DB, id);
  if (!ticket) return fail(404, 'No ticket ' + ticketNumber(id) + '.');

  const r = await sendEmail(env, replyEmail(ticket, text));
  await addEvent(env.DB, id, admin.email, 'reply', text, { ok: r.ok, error: r.ok ? undefined : r.error });
  const out = await getTicketDetail(env.DB, id);
  if (!r.ok) {
    out.warning = 'The reply is saved in the history, but the email didn\'t go: ' + r.error;
    return json(out, 502);
  }
  return json(out);
});
