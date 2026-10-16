-- Grid Central support tickets: the D1 database (binding DB).
-- Safe to run more than once: nothing here replaces or deletes existing data.
-- Run with: npx wrangler d1 migrations apply grid-central-support --remote
-- or paste the whole file into the database's Console in the Cloudflare dashboard.

-- Ticket numbers: GC-1001 is the first. Kept here so a deleted ticket's number is never reused.
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);
INSERT OR IGNORE INTO counters (name, value) VALUES ('ticket', 1000);

-- One row per ticket. answers holds every form answer as JSON (field id -> text, or a list for the area picks).
CREATE TABLE IF NOT EXISTS tickets (
  id         INTEGER PRIMARY KEY,
  type       TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'help')),
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'needs_info', 'confirmed', 'fixed_in_dev', 'closed')),
  priority   TEXT NOT NULL DEFAULT 'none' CHECK (priority IN ('none', 'low', 'medium', 'high', 'critical')),
  summary    TEXT NOT NULL,
  email      TEXT NOT NULL,
  version    TEXT,
  areas      TEXT NOT NULL DEFAULT '[]',
  answers    TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS tickets_by_status ON tickets (status, id);
CREATE INDEX IF NOT EXISTS tickets_by_type ON tickets (type, id);
CREATE INDEX IF NOT EXISTS tickets_by_version ON tickets (version);
CREATE INDEX IF NOT EXISTS tickets_by_email ON tickets (email, created_at);
CREATE INDEX IF NOT EXISTS tickets_by_created ON tickets (created_at);

-- Attachments. The file itself is in the private R2 bucket (binding FILES) under r2_key.
CREATE TABLE IF NOT EXISTS ticket_files (
  id           TEXT PRIMARY KEY,
  ticket_id    INTEGER NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  r2_key       TEXT NOT NULL,
  filename     TEXT NOT NULL,
  content_type TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('log', 'image', 'video')),
  size         INTEGER NOT NULL,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ticket_files_by_ticket ON ticket_files (ticket_id);

-- The ticket's history: created, status and priority changes, private notes, replies and every email sent.
-- actor is 'customer', 'system' or the admin's email. meta is JSON (for example {"from":"new","to":"confirmed"}).
CREATE TABLE IF NOT EXISTS ticket_events (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  at        TEXT NOT NULL,
  actor     TEXT NOT NULL,
  kind      TEXT NOT NULL CHECK (kind IN ('created', 'status', 'priority', 'note', 'reply', 'email', 'file')),
  body      TEXT,
  meta      TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS ticket_events_by_ticket ON ticket_events (ticket_id, id);
