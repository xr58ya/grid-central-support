// GET /api/admin/tickets?type=&status=&priority=&area=&version=&q=&offset=
// Tickets newest first, 50 at a time, plus the number of tickets in each status.

import { adminRoute } from '../../../../lib/admin.js';
import { fail, json } from '../../../../lib/http.js';
import { ALL_AREAS, FORMS, PRIORITY_IDS, STATUS_IDS, normalizeVersion, parseTicketNumber } from '../../../../lib/forms.js';
import { listTickets, statusCounts } from '../../../../lib/tickets.js';

const PAGE = 50;

export const onRequestGet = adminRoute(async function ({ request, env }) {
  const p = new URL(request.url).searchParams;
  const filters = {};
  const type = p.get('type') || '';
  if (type) {
    if (!Object.prototype.hasOwnProperty.call(FORMS, type)) return fail(400, 'Unknown type.');
    filters.type = type;
  }
  const status = p.get('status') || '';
  if (status) {
    if (status !== 'open' && STATUS_IDS.indexOf(status) < 0) return fail(400, 'Unknown status.');
    filters.status = status;
  }
  const priority = p.get('priority') || '';
  if (priority) {
    if (PRIORITY_IDS.indexOf(priority) < 0) return fail(400, 'Unknown priority.');
    filters.priority = priority;
  }
  const area = p.get('area') || '';
  if (area) {
    if (ALL_AREAS.indexOf(area) < 0) return fail(400, 'Unknown area.');
    filters.area = area;
  }
  const version = (p.get('version') || '').trim();
  if (version) {
    const v = normalizeVersion(version) || version.replace(/^v\s*/i, '');
    if (!/^\d+(\.\d+){0,3}$/.test(v)) return fail(400, 'Type a version like 0.5.9.2 (or 0.5.9 for all of 0.5.9.x).');
    filters.version = v;
  }
  const q = (p.get('q') || '').trim().slice(0, 200);
  if (q) {
    filters.q = q;
    filters.number = parseTicketNumber(q);
  }
  const offset = Math.max(0, Math.min(100000, parseInt(p.get('offset') || '0', 10) || 0));

  const list = await listTickets(env.DB, filters, PAGE, offset);
  const counts = await statusCounts(env.DB);
  return json({ tickets: list.tickets, more: list.more, offset: offset, counts: counts });
});
