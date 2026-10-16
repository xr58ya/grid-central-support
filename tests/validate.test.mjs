import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission, checkFile, checkFileSet, safeFileName, isValidEmail, FILE_LIMITS } from '../lib/validate.js';
import { parseTicketNumber, normalizeVersion } from '../lib/forms.js';
import { errorLines, contentDisposition, decodeText } from '../lib/files.js';
import { normalizeTeamDomain } from '../lib/access.js';
import { bugAnswers, PNG } from './helpers.mjs';

test('a complete bug report passes, with the version taken out of "V 0.5.9.2 · BETA"', function () {
  const r = validateSubmission({ type: 'bug', email: 'Driver@Example.COM', answers: bugAnswers() });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.equal(r.value.version, '0.5.9.2');
  assert.equal(r.value.email, 'Driver@example.com');
  assert.deepEqual(r.value.areas, ['Engineer, strategy or coach', 'Talkback / voice / commentary']);
  assert.equal(r.value.summary, 'Spotter stops calling cars after pitting');
});

test('missing required answers and a missing email are reported per field', function () {
  const r = validateSubmission({ type: 'bug', email: '', answers: { summary: 'x' } });
  assert.equal(r.ok, false);
  for (const id of ['version', 'area', 'what-happened', 'steps', 'frequency', 'os', 'email']) assert.ok(r.errors[id], id);
  assert.equal(r.errors.summary, undefined);
  assert.equal(r.errors.session, undefined, 'optional fields are fine empty');
});

test('pick-lists only take their own options', function () {
  let r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ frequency: 'Always' }) });
  assert.ok(r.errors.frequency);
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ area: ['Something new'] }) });
  assert.ok(r.errors.area, '"Something new" is only on the feature form');
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ area: 'Translations' }) });
  assert.ok(r.errors.area, 'area must be a list');
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ area: ['Translations', 'Translations'] }) });
  assert.deepEqual(r.value.areas, ['Translations'], 'repeats are dropped');
});

test('unknown types, unknown fields, wrong value types and over-long answers', function () {
  assert.equal(validateSubmission({ type: 'hack', email: 'a@b.co', answers: {} }).ok, false);
  assert.equal(validateSubmission(null).ok, false);
  assert.equal(validateSubmission([]).ok, false);
  let r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ isAdmin: true, '__proto__': { x: 1 } }) });
  assert.equal(r.ok, true);
  assert.equal(Object.prototype.hasOwnProperty.call(r.value.answers, 'isAdmin'), false);
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ steps: { evil: 1 } }) });
  assert.ok(r.errors.steps);
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ summary: 'x'.repeat(151) }) });
  assert.ok(r.errors.summary);
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ steps: 'x'.repeat(8001) }) });
  assert.ok(r.errors.steps);
  r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ logs: 'x'.repeat(20000) }) });
  assert.equal(r.ok, true, 'logs may be longer');
});

test('control characters are removed; one-line answers stay on one line', function () {
  const r = validateSubmission({ type: 'bug', email: 'a@b.co', answers: bugAnswers({ summary: 'Crash\non\u0000 start', steps: 'a\r\nb\u0007' }) });
  assert.equal(r.value.summary, 'Crash on start');
  assert.equal(r.value.answers.steps, 'a\nb');
});

test('the feature and help forms', function () {
  let r = validateSubmission({ type: 'feature', email: 'a@b.co', answers: { summary: 'Pit warning', area: ['Something new'], problem: 'p', solution: 's', importance: 'Nice to have' } });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.equal(r.value.version, null);
  r = validateSubmission({ type: 'help', email: 'a@b.co', answers: { summary: 'OBS', version: '0.5.9.2', area: ['Overlays (in-game or OBS)'], goal: 'g', tried: 't' } });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
});

test('email addresses', function () {
  assert.ok(isValidEmail('driver@example.com'));
  assert.ok(isValidEmail('first.last+gc@sub.example.co.uk'));
  for (const bad of ['', 'x', 'a@b', 'a b@c.de', 'a@b..com', '<a@b.com>', 'a@b.com\nBcc: c@d.com', 'a@-b.com']) {
    assert.equal(isValidEmail(bad), false, bad);
  }
});

test('attachments are checked by extension, size and first bytes', function () {
  assert.equal(checkFile('shot.png', 100, PNG).ok, true);
  assert.equal(checkFile('shot.png', 100, PNG).contentType, 'image/png');
  assert.equal(checkFile('shot.PNG', 100, PNG).ok, true);
  assert.equal(checkFile('shot.png', 100, new TextEncoder().encode('<svg onload=alert(1)>')).ok, false, 'not really a PNG');
  assert.equal(checkFile('drawing.svg', 100, new TextEncoder().encode('<svg/>')).ok, false);
  assert.equal(checkFile('setup.exe', 100, new Uint8Array([0x4d, 0x5a])).ok, false);
  assert.equal(checkFile('page.html', 100, new TextEncoder().encode('<html>')).ok, false);
  assert.equal(checkFile('companion.log', 100, new TextEncoder().encode('12:00 started')).ok, true);
  assert.equal(checkFile('companion.log', 100, new Uint8Array([0x4d, 0x5a, 0x00, 0x01])).ok, false, 'binary with a .log name');
  const utf16 = checkFile('companion.log', 100, new Uint8Array([0xff, 0xfe, 0x31, 0x00]));
  assert.equal(utf16.ok, true);
  assert.match(utf16.contentType, /utf-16/);
  assert.equal(checkFile('a.jpg', 100, new Uint8Array([0xff, 0xd8, 0xff, 0xe0])).ok, true);
  assert.equal(checkFile('a.webp', 100, new TextEncoder().encode('RIFF\u0000\u0000\u0000\u0000WEBPVP8 ')).ok, true);
  assert.equal(checkFile('a.mp4', 100, new Uint8Array([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70])).ok, true);
  assert.equal(checkFile('big.png', FILE_LIMITS.maxFileBytes + 1, PNG).ok, false);
  assert.equal(checkFile('empty.png', 0, PNG).ok, false);
  assert.equal(checkFileSet(new Array(6).fill({ size: 1 })) !== null, true);
  assert.equal(checkFileSet([{ size: 20e6 }, { size: 9e6 }]) !== null, true);
  assert.equal(checkFileSet([{ size: 1 }, { size: 2 }]), null);
});

test('file names are made safe for storage keys and download headers', function () {
  assert.equal(safeFileName('../../etc/passwd'), 'passwd');
  assert.equal(safeFileName('C:\\Users\\Max\\companion.log'), 'companion.log');
  assert.equal(safeFileName('my "shot" <1>.png'), 'my_shot_1_.png');
  assert.equal(safeFileName('.htaccess'), 'htaccess');
  assert.equal(safeFileName(''), 'file');
  assert.equal(safeFileName('a'.repeat(300) + '.png').length, 100);
  assert.ok(safeFileName('a'.repeat(300) + '.png').endsWith('.png'));
  assert.equal(contentDisposition('attachment', 'companion.log'), 'attachment; filename="companion.log"; filename*=UTF-8\'\'companion.log');
});

test('ticket numbers and versions', function () {
  assert.equal(parseTicketNumber('GC-1001'), 1001);
  assert.equal(parseTicketNumber('gc 1002'), 1002);
  assert.equal(parseTicketNumber('1003'), 1003);
  assert.equal(parseTicketNumber('GC-1001; DROP TABLE tickets'), null);
  assert.equal(parseTicketNumber(''), null);
  assert.equal(normalizeVersion('V 0.5.9.1 · BETA'), '0.5.9.1');
  assert.equal(normalizeVersion('0.5.10'), '0.5.10');
  assert.equal(normalizeVersion('latest'), null);
});

test('error lines are picked out of a log, with stack trace lines that follow', function () {
  const log = ['10:00 INFO started', '10:01 ERROR overlay: failed to bind port', '    at Server.listen (net.js:1)',
    '10:02 INFO ok', 'Traceback (most recent call last):', '  File "x.py", line 1', '10:03 WARN slow'].join('\r\n');
  assert.deepEqual(errorLines(log, 40), ['10:01 ERROR overlay: failed to bind port', '    at Server.listen (net.js:1)',
    'Traceback (most recent call last):', '  File "x.py", line 1']);
  assert.equal(errorLines(Array(100).fill('ERROR x').join('\n'), 40).length, 40);
  const le = new Uint8Array([0x48, 0, 0x69, 0]);
  assert.equal(decodeText(le, 'text/plain; charset=utf-16'), 'Hi');
});

test('Access team domain in any of the forms the dashboard shows', function () {
  assert.equal(normalizeTeamDomain('gcteam'), 'gcteam.cloudflareaccess.com');
  assert.equal(normalizeTeamDomain('https://gcteam.cloudflareaccess.com/'), 'gcteam.cloudflareaccess.com');
  assert.equal(normalizeTeamDomain('gcteam.cloudflareaccess.com'), 'gcteam.cloudflareaccess.com');
  assert.equal(normalizeTeamDomain('evil.com'), '', 'only cloudflareaccess.com team domains');
  assert.equal(normalizeTeamDomain('x.cloudflareaccess.com.evil.com'), '');
  assert.equal(normalizeTeamDomain(''), '');
});
