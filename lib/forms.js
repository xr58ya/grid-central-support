// The three support forms, as the server sees them.
//
// The field ids match .github/ISSUE_TEMPLATE/*.yml, and the ids, labels, types, options and "required" flags
// match the FORMS list in report.html. tests/run.mjs checks both, so change all three together.

export const AREAS = [
  'Install or update', 'Setup wizard', 'Dashboard / main app', 'Overlays (in-game or OBS)',
  'Phone companion', 'Talkback / voice / commentary', 'Engineer, strategy or coach',
  'Telemetry, lap data or debrief', 'Team hub or online features', 'Paint / spray booth', 'Discord link',
  'Account, beta code or plan', 'Translations'
];

// Longest answer accepted for each kind of box (characters).
export const MAX_LENGTH = { input: 200, textarea: 8000, logs: 20000, summary: 150, email: 254 };

export const FORMS = {
  bug: {
    name: 'Bug report',
    short: 'Bug',
    fields: [
      { id: 'summary', type: 'input', label: 'Short summary', required: true },
      { id: 'version', type: 'input', label: 'Grid Central version', required: true },
      { id: 'area', type: 'multi', label: 'Which part of Grid Central?', required: true, options: AREAS.concat(['Other / not sure']) },
      { id: 'what-happened', type: 'textarea', label: 'What happened?', required: true },
      { id: 'steps', type: 'textarea', label: 'Steps to reproduce', required: true },
      { id: 'frequency', type: 'select', label: 'How often does it happen?', required: true, options: ['Every time', 'Sometimes', 'Only happened once'] },
      { id: 'session', type: 'input', label: 'iRacing session details' },
      { id: 'os', type: 'input', label: 'Windows version', required: true },
      { id: 'hardware', type: 'textarea', label: 'Hardware and setup' },
      { id: 'logs', type: 'textarea', label: 'Error messages from companion.log', max: MAX_LENGTH.logs }
    ]
  },
  feature: {
    name: 'Feature request',
    short: 'Feature',
    fields: [
      { id: 'summary', type: 'input', label: 'Short summary', required: true },
      { id: 'area', type: 'multi', label: 'Which part of Grid Central?', required: true, options: AREAS.concat(['Something new']) },
      { id: 'problem', type: 'textarea', label: 'What are you trying to do?', required: true },
      { id: 'solution', type: 'textarea', label: 'What would you like Grid Central to do?', required: true },
      { id: 'workaround', type: 'textarea', label: 'How do you handle it today?' },
      { id: 'importance', type: 'select', label: 'How important is this to you?', required: true, options: ['Nice to have', 'Would use it often', 'I can\'t use Grid Central properly without it'] },
      { id: 'extra', type: 'textarea', label: 'Examples or links' }
    ]
  },
  help: {
    name: 'Setup help',
    short: 'Help',
    fields: [
      { id: 'summary', type: 'input', label: 'Short summary', required: true },
      { id: 'version', type: 'input', label: 'Grid Central version', required: true },
      { id: 'area', type: 'multi', label: 'What do you need help with?', required: true, options: AREAS.concat(['Other / not sure']) },
      { id: 'goal', type: 'textarea', label: 'What are you trying to set up?', required: true },
      { id: 'tried', type: 'textarea', label: 'What have you tried so far?', required: true },
      { id: 'os', type: 'input', label: 'Windows version' }
    ]
  }
};

// Every area anyone can pick, for the admin filter.
export const ALL_AREAS = AREAS.concat(['Something new', 'Other / not sure']);

export const STATUSES = [
  { id: 'new', label: 'New', customer: 'New: we haven\'t looked at it yet.' },
  { id: 'needs_info', label: 'Needs info', customer: 'Needs info: we need a little more detail from you.' },
  { id: 'confirmed', label: 'Confirmed', customer: 'Confirmed: we\'ve reproduced it or accepted it, and it\'s on our list.' },
  { id: 'fixed_in_dev', label: 'Fixed in dev', customer: 'Fixed in development: the fix will be in a coming update.' },
  { id: 'closed', label: 'Closed', customer: 'Closed.' }
];

export const PRIORITIES = [
  { id: 'none', label: 'Not set' },
  { id: 'low', label: 'Low', hint: 'Minor or cosmetic' },
  { id: 'medium', label: 'Medium', hint: 'Has a workaround' },
  { id: 'high', label: 'High', hint: 'Major feature broken, no workaround' },
  { id: 'critical', label: 'Critical', hint: 'App unusable or data lost' }
];

export const STATUS_IDS = STATUSES.map(function (s) { return s.id; });
export const PRIORITY_IDS = PRIORITIES.map(function (p) { return p.id; });

export function statusLabel(id) {
  const s = STATUSES.find(function (x) { return x.id === id; });
  return s ? s.label : id;
}

export function ticketNumber(id) {
  return 'GC-' + id;
}

// "GC-1001", "gc 1001" or "1001" -> 1001; anything else -> null.
export function parseTicketNumber(text) {
  const m = /^\s*(?:gc[-\s]?)?(\d{1,9})\s*$/i.exec(String(text == null ? '' : text));
  return m ? Number(m[1]) : null;
}

// "V 0.5.9.2 · BETA" -> "0.5.9.2". Used for the version filter.
export function normalizeVersion(text) {
  const m = /(\d+(?:\.\d+){1,3})/.exec(String(text || ''));
  return m ? m[1] : null;
}

// The answers as plain text, one "Label: answer" block per answered field (used in emails).
export function answersAsText(type, answers, opts) {
  const spec = FORMS[type];
  if (!spec) return '';
  const skip = (opts && opts.skip) || [];
  const lines = [];
  spec.fields.forEach(function (f) {
    if (skip.indexOf(f.id) >= 0) return;
    const raw = answers ? answers[f.id] : null;
    const v = Array.isArray(raw) ? raw.join('; ') : (raw || '');
    if (!v) return;
    const label = /[?:]$/.test(f.label) ? f.label : f.label + ':';
    lines.push(label + (v.indexOf('\n') >= 0 || v.length > 60 ? '\n' + v : ' ' + v), '');
  });
  return lines.join('\n').trim();
}
