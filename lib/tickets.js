// Reading and writing tickets in D1 (binding DB). Every query uses bound parameters, never pasted-in text.

import { FORMS, ticketNumber } from './forms.js';
import { nowIso } from './http.js';

function parseJson(text, fallback) {
  try { return text ? JSON.parse(text) : fallback; } catch (e) { return fallback; }
}

export function rowToTicket(row) {
  if (!row) return null;
  return {
    id: row.id,
    number: ticketNumber(row.id),
    type: row.type,
    status: row.status,
    priority: row.priority,
    summary: row.summary,
    email: row.email,
    version: row.version,
    areas: parseJson(row.areas, []),
    answers: row.answers === undefined ? undefined : parseJson(row.answers, {}),
    fileCount: row.file_count === undefined ? undefined : row.file_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function rowToEvent(row) {
  return {
    id: row.id,
    at: row.at,
    actor: row.actor,
    kind: row.kind,
    body: row.body,
    meta: parseJson(row.meta, {})
  };
}

function rowToFile(row) {
  return {
    id: row.id,
    filename: row.filename,
    contentType: row.content_type,
    kind: row.kind,
    size: row.size,
    createdAt: row.created_at
  };
}

// How many tickets were sent since a time, overall and from one address (for the send limits).
export async function recentCounts(db, sinceIso, email) {
  const row = await db.prepare(
    'SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN email = ? THEN 1 ELSE 0 END), 0) AS mine FROM tickets WHERE created_at > ?'
  ).bind(email, sinceIso).first();
  return { total: (row && row.total) || 0, mine: (row && row.mine) || 0 };
}

/**
 * Stores a new ticket and its "created" history entry in one transaction. Returns the new id (1001, 1002, ...).
 * The number comes from the counters table, so a deleted ticket's number is never used again.
 */
export async function createTicket(db, v) {
  const now = nowIso();
  const results = await db.batch([
    db.prepare('UPDATE counters SET value = value + 1 WHERE name = ?').bind('ticket'),
    db.prepare(
      'INSERT INTO tickets (id, type, status, priority, summary, email, version, areas, answers, created_at, updated_at) ' +
      'SELECT value, ?, \'new\', \'none\', ?, ?, ?, ?, ?, ?, ? FROM counters WHERE name = ? RETURNING id'
    ).bind(v.type, v.summary, v.email, v.version, JSON.stringify(v.areas), JSON.stringify(v.answers), now, now, 'ticket'),
    db.prepare(
      'INSERT INTO ticket_events (ticket_id, at, actor, kind, body, meta) SELECT value, ?, ?, ?, NULL, ? FROM counters WHERE name = ?'
    ).bind(now, 'customer', 'created', '{}', 'ticket')
  ]);
  const rows = results[1] && results[1].results;
  if (!rows || !rows.length) throw new Error('Ticket not stored: is the database set up (migrations/0001_init.sql)?');
  return rows[0].id;
}

export async function addFile(db, ticketId, f) {
  await db.prepare(
    'INSERT INTO ticket_files (id, ticket_id, r2_key, filename, content_type, kind, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(f.id, ticketId, f.key, f.filename, f.contentType, f.kind, f.size, nowIso()).run();
}

/** Adds a history entry and marks the ticket as updated. */
export async function addEvent(db, ticketId, actor, kind, body, meta) {
  const now = nowIso();
  await db.batch([
    db.prepare('INSERT INTO ticket_events (ticket_id, at, actor, kind, body, meta) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(ticketId, now, actor, kind, body == null ? null : String(body), JSON.stringify(meta || {})),
    db.prepare('UPDATE tickets SET updated_at = ? WHERE id = ?').bind(now, ticketId)
  ]);
}

export async function getTicket(db, id) {
  const row = await db.prepare(
    'SELECT id, type, status, priority, summary, email, version, areas, answers, created_at, updated_at FROM tickets WHERE id = ?'
  ).bind(id).first();
  return rowToTicket(row);
}

export async function getTicketDetail(db, id) {
  const ticket = await getTicket(db, id);
  if (!ticket) return null;
  const [files, events] = await db.batch([
    db.prepare('SELECT id, filename, content_type, kind, size, created_at FROM ticket_files WHERE ticket_id = ? ORDER BY created_at, id').bind(id),
    db.prepare('SELECT id, at, actor, kind, body, meta FROM ticket_events WHERE ticket_id = ? ORDER BY id').bind(id)
  ]);
  const spec = FORMS[ticket.type];
  return {
    ticket: ticket,
    form: spec ? { name: spec.name, short: spec.short, fields: spec.fields.map(function (f) { return { id: f.id, label: f.label, type: f.type }; }) } : null,
    files: (files.results || []).map(rowToFile),
    events: (events.results || []).map(rowToEvent)
  };
}

export async function getFile(db, fileId) {
  return db.prepare(
    'SELECT id, ticket_id, r2_key, filename, content_type, kind, size, created_at FROM ticket_files WHERE id = ?'
  ).bind(fileId).first();
}

// For LIKE: makes %, _ and \ in the search text match themselves.
function likeEscape(s) {
  return s.replace(/[\\%_]/g, function (c) { return '\\' + c; });
}

/**
 * Tickets newest first. filters: { type, status ('open' = everything but closed), priority, area, version, q },
 * limit, offset. Returns { tickets, more }.
 */
export async function listTickets(db, filters, limit, offset) {
  const where = [];
  const args = [];
  const f = filters || {};
  if (f.type) { where.push('t.type = ?'); args.push(f.type); }
  if (f.status === 'open') { where.push('t.status != ?'); args.push('closed'); }
  else if (f.status) { where.push('t.status = ?'); args.push(f.status); }
  if (f.priority) { where.push('t.priority = ?'); args.push(f.priority); }
  if (f.area) { where.push('EXISTS (SELECT 1 FROM json_each(t.areas) AS a WHERE a.value = ?)'); args.push(f.area); }
  if (f.version) {
    where.push('(t.version = ? OR t.version LIKE ? ESCAPE \'\\\')');
    args.push(f.version, likeEscape(f.version) + '.%');
  }
  if (f.q) {
    // Matches the ticket number ("GC-1001" or "1001"), or the text anywhere in the summary, email or answers.
    const like = '%' + likeEscape(f.q) + '%';
    where.push('(t.id = ? OR t.summary LIKE ? ESCAPE \'\\\' OR t.email LIKE ? ESCAPE \'\\\' OR t.answers LIKE ? ESCAPE \'\\\')');
    args.push(f.number == null ? -1 : f.number, like, like, like);
  }
  const sql =
    'SELECT t.id, t.type, t.status, t.priority, t.summary, t.email, t.version, t.areas, t.created_at, t.updated_at, ' +
    '(SELECT COUNT(*) FROM ticket_files AS tf WHERE tf.ticket_id = t.id) AS file_count ' +
    'FROM tickets AS t' + (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY t.id DESC LIMIT ? OFFSET ?';
  args.push(limit + 1, offset);
  const out = await db.prepare(sql).bind(...args).all();
  const rows = out.results || [];
  return { tickets: rows.slice(0, limit).map(rowToTicket), more: rows.length > limit };
}

export async function statusCounts(db) {
  const out = await db.prepare('SELECT status, COUNT(*) AS n FROM tickets GROUP BY status').all();
  const counts = {};
  (out.results || []).forEach(function (r) { counts[r.status] = r.n; });
  return counts;
}

/** Deletes a ticket, its history and file records. Returns the storage keys of its files, to remove from R2. */
export async function deleteTicket(db, id) {
  const files = await db.prepare('SELECT r2_key FROM ticket_files WHERE ticket_id = ?').bind(id).all();
  await db.batch([
    db.prepare('DELETE FROM ticket_events WHERE ticket_id = ?').bind(id),
    db.prepare('DELETE FROM ticket_files WHERE ticket_id = ?').bind(id),
    db.prepare('DELETE FROM tickets WHERE id = ?').bind(id)
  ]);
  return (files.results || []).map(function (r) { return r.r2_key; });
}
