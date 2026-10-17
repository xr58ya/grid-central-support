// Checks a form submission before anything is stored. Pure functions, so tests/run.mjs can run them in Node.

import { FORMS, MAX_LENGTH, normalizeVersion } from './forms.js';

// Attachments: what's accepted and how big.
export const FILE_LIMITS = {
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  maxNameLength: 100
};

// Extension -> what it must be. Images and videos are checked by their first bytes, text by having no zero bytes.
const FILE_TYPES = {
  log: { kind: 'log', contentType: 'text/plain; charset=utf-8', check: isText },
  txt: { kind: 'log', contentType: 'text/plain; charset=utf-8', check: isText },
  png: { kind: 'image', contentType: 'image/png', check: startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  jpg: { kind: 'image', contentType: 'image/jpeg', check: startsWith([0xff, 0xd8, 0xff]) },
  jpeg: { kind: 'image', contentType: 'image/jpeg', check: startsWith([0xff, 0xd8, 0xff]) },
  gif: { kind: 'image', contentType: 'image/gif', check: startsWith([0x47, 0x49, 0x46, 0x38]) },
  webp: { kind: 'image', contentType: 'image/webp', check: isWebp },
  mp4: { kind: 'video', contentType: 'video/mp4', check: isMp4 },
  webm: { kind: 'video', contentType: 'video/webm', check: startsWith([0x1a, 0x45, 0xdf, 0xa3]) }
};

export const ACCEPTED_EXTENSIONS = Object.keys(FILE_TYPES).map(function (e) { return '.' + e; });

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isValidEmail(text) {
  return typeof text === 'string' && text.length <= MAX_LENGTH.email && EMAIL_RE.test(text);
}

// Removes control characters (keeps new lines and tabs) and turns Windows line ends into \n.
function clean(text, multiline) {
  let s = String(text).replace(/\r\n?/g, '\n');
  s = multiline ? s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '') : s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/ {2,}/g, ' ');
  return s.trim();
}

function maxFor(f) {
  if (f.max) return f.max;
  if (f.id === 'summary') return MAX_LENGTH.summary;
  return f.type === 'textarea' ? MAX_LENGTH.textarea : MAX_LENGTH.input;
}

/**
 * Checks { type, email, answers } from the report form.
 * Returns { ok: true, value: { type, email, summary, version, areas, answers } }
 * or { ok: false, errors: { fieldId: message }, message }.
 * Answers for ids the form doesn't have are dropped.
 */
export function validateSubmission(payload) {
  const errors = {};
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, errors: {}, message: 'The form data could not be read.' };
  }
  const type = payload.type;
  if (typeof type !== 'string' || !Object.prototype.hasOwnProperty.call(FORMS, type)) {
    return { ok: false, errors: {}, message: 'Unknown form type.' };
  }
  const spec = FORMS[type];
  const given = payload.answers && typeof payload.answers === 'object' && !Array.isArray(payload.answers) ? payload.answers : {};
  const answers = {};

  spec.fields.forEach(function (f) {
    const raw = Object.prototype.hasOwnProperty.call(given, f.id) ? given[f.id] : null;
    if (f.type === 'multi') {
      if (raw != null && !Array.isArray(raw)) { errors[f.id] = 'Pick from the list.'; return; }
      const picked = [];
      (raw || []).forEach(function (v) {
        if (typeof v !== 'string' || f.options.indexOf(v) < 0) { errors[f.id] = 'Pick from the list.'; return; }
        if (picked.indexOf(v) < 0) picked.push(v);
      });
      if (errors[f.id]) return;
      if (f.required && !picked.length) { errors[f.id] = 'Pick at least one.'; return; }
      answers[f.id] = picked;
      return;
    }
    if (raw != null && typeof raw !== 'string') { errors[f.id] = 'Please fill this in.'; return; }
    const v = raw == null ? '' : clean(raw, f.type === 'textarea');
    if (f.required && !v) { errors[f.id] = f.type === 'select' ? 'Choose one.' : 'Please fill this in.'; return; }
    if (f.type === 'select' && v && f.options.indexOf(v) < 0) { errors[f.id] = 'Choose one from the list.'; return; }
    const max = maxFor(f);
    if (v.length > max) { errors[f.id] = 'Please keep this under ' + max + ' characters (it has ' + v.length + ').'; return; }
    answers[f.id] = v;
  });

  const email = typeof payload.email === 'string' ? clean(payload.email, false) : '';
  if (!email) errors.email = 'Please enter your email address, so we can reply.';
  else if (!isValidEmail(email)) errors.email = 'That doesn\'t look like an email address.';

  if (Object.keys(errors).length) {
    return { ok: false, errors: errors, message: 'Some answers are missing or need a change.' };
  }
  const at = email.lastIndexOf('@');
  return {
    ok: true,
    value: {
      type: type,
      email: email.slice(0, at) + '@' + email.slice(at + 1).toLowerCase(),
      summary: answers.summary,
      version: normalizeVersion(answers.version),
      areas: answers.area || [],
      answers: answers
    }
  };
}

// A file name that's safe in a storage key and a download header: letters, digits, dot, dash and underscore.
// The name and the extension are cleaned separately, so a name in another script ("Снимок экрана.png") keeps its
// extension ("file.png").
export function safeFileName(name) {
  const base = String(name || '').split(/[\\/]/).pop().normalize('NFKD');
  const dot = base.lastIndexOf('.');
  const ext = dot > 0 ? base.slice(dot + 1).replace(/[^A-Za-z0-9]+/g, '').slice(0, 16) : '';
  let stem = (dot > 0 ? base.slice(0, dot) : base).replace(/[^\w.\-]+/g, '_').replace(/_+/g, '_').replace(/^[._]+/, '');
  const tail = ext ? '.' + ext : '';
  if (stem.length + tail.length > FILE_LIMITS.maxNameLength) stem = stem.slice(0, FILE_LIMITS.maxNameLength - tail.length);
  return (stem || 'file') + tail;
}

function extensionOf(name) {
  const m = /\.([A-Za-z0-9]+)$/.exec(String(name || ''));
  return m ? m[1].toLowerCase() : '';
}

/**
 * Checks one attachment from its name, size and first bytes (a Uint8Array of up to 4 KB).
 * Returns { ok: true, kind, contentType, name } or { ok: false, error }.
 */
export function checkFile(name, size, head) {
  const display = String(name || 'file').slice(0, 120);
  const ext = extensionOf(name);
  const t = FILE_TYPES[ext];
  if (!t) return { ok: false, error: display + ': only ' + ACCEPTED_EXTENSIONS.join(' ') + ' files can be attached.' };
  if (!size) return { ok: false, error: display + ' is empty.' };
  if (size > FILE_LIMITS.maxFileBytes) return { ok: false, error: display + ' is bigger than ' + mb(FILE_LIMITS.maxFileBytes) + '.' };
  const b = head || new Uint8Array(0);
  if (!t.check(b)) return { ok: false, error: display + ' doesn\'t look like a .' + ext + ' file.' };
  const contentType = t.kind === 'log' && isUtf16(b) ? 'text/plain; charset=utf-16' : t.contentType;
  return { ok: true, kind: t.kind, contentType: contentType, name: safeFileName(name) };
}

// Checks the number and total size of the attachments. files: [{ name, size }].
export function checkFileSet(files) {
  if (files.length > FILE_LIMITS.maxFiles) return 'Attach up to ' + FILE_LIMITS.maxFiles + ' files.';
  const total = files.reduce(function (n, f) { return n + (f.size || 0); }, 0);
  if (total > FILE_LIMITS.maxTotalBytes) return 'The files add up to more than ' + mb(FILE_LIMITS.maxTotalBytes) + '.';
  return null;
}

function mb(bytes) { return Math.round(bytes / 1024 / 1024) + ' MB'; }

function startsWith(sig) {
  return function (b) {
    if (b.length < sig.length) return false;
    for (let i = 0; i < sig.length; i++) if (b[i] !== sig[i]) return false;
    return true;
  };
}

function isWebp(b) {
  return b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
}

function isMp4(b) {
  return b.length >= 8 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70;
}

function isUtf16(b) {
  return b.length >= 2 && ((b[0] === 0xff && b[1] === 0xfe) || (b[0] === 0xfe && b[1] === 0xff));
}

// Plain text: no zero bytes, unless it's UTF-16 with a byte order mark (some Windows tools write that).
function isText(b) {
  if (isUtf16(b)) return true;
  for (let i = 0; i < b.length; i++) if (b[i] === 0) return false;
  return true;
}
