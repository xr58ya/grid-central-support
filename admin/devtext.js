// "Copy for development": turns a ticket into the summary development asks for (see the source repository's
// CLAUDE.md, rule 4): version, track, car, session, steps, expected, actual, frequency and companion.log lines.
// Plain functions with no page access, so tests/run.mjs can check them in Node.
(function (root) {
  'use strict';

  // Words for the kind of session, which people sometimes put where the car would go ("Practice at Spa").
  var SESSION_WORDS = /^(?:(?:official|open|hosted|league|team|private)\s+)*(?:practice|qualifying|quali|qualy|race|time trial|test(?:ing)?|replay|warm[- ]?up|session)s?$/i;

  // "Porsche 963 at Spa, team race" -> { car: "Porsche 963", track: "Spa", kind: "team race" }
  // "Official race at Daytona in the Mustang GT3" -> { car: "Mustang GT3", track: "Daytona", kind: "Official race" }
  function parseSession(text) {
    var s = String(text || '').trim();
    var m = /^(.+?)\s+(?:at|@|on)\s+([^,;]+?)\s*(?:[,;]\s*(.+))?$/i.exec(s);
    if (!m) return { car: '', track: '', kind: '' };
    var car = m[1].trim(), track = m[2].trim(), kind = (m[3] || '').trim();
    if (SESSION_WORDS.test(car)) {
      kind = kind ? car + ', ' + kind : car;
      var c = /^(.+?)\s+(?:in|with)\s+(?:the\s+|a\s+|an\s+|my\s+)?(.+)$/i.exec(track);
      car = c ? c[2].trim() : '';
      if (c) track = c[1].trim();
    }
    return { car: car, track: track, kind: kind };
  }

  var ACTUAL_LABEL = /\n\s*actual(?: result| behaviou?r)?\s*[:\-]\s*/i;

  // The bug form asks for the problem and what was expected in one box. If the customer wrote "I expected ...",
  // "Expected: ..." or "It should ...", split it there; otherwise everything is the actual behaviour. An "Actual:"
  // line after the expected part goes back to the actual behaviour. ("I expect it's because ..." is a guess, not
  // what they expected, so a bare present-tense "I expect" doesn't split.)
  function splitExpected(text) {
    var s = String(text || '').trim();
    var re = /(^|[.!?]\s+|\n\s*)((?:expected(?: result| behaviou?r)?\s*[:\-]|i expected\b|i(?:'d| would) (?:have )?expect(?:ed)?\b|it should(?:n't| not)?\b|should have\b|instead,? it should\b)[\s\S]*)$/i;
    var m = re.exec(s);
    if (!m || m.index + m[1].length === 0) return { actual: s.replace(/^actual(?: result| behaviou?r)?\s*[:\-]\s*/i, ''), expected: '' };
    var actual = s.slice(0, m.index + m[1].length).trim().replace(/^actual(?: result| behaviou?r)?\s*[:\-]\s*/i, '');
    var expected = m[2].replace(/^expected(?: result| behaviou?r)?\s*[:\-]\s*/i, '').trim();
    var later = ACTUAL_LABEL.exec(expected);
    if (later) {
      var rest = expected.slice(later.index + later[0].length).trim();
      expected = expected.slice(0, later.index).trim();
      if (rest) actual = actual ? actual + '\n' + rest : rest;
    }
    return { actual: actual, expected: expected };
  }

  function block(label, value) {
    var v = String(value == null ? '' : value).trim();
    if (!v) return label + ': (not given)';
    return v.indexOf('\n') >= 0 ? label + ':\n' + v : label + ': ' + v;
  }

  /**
   * detail: the ticket detail from /api/admin/tickets/<id> ({ ticket, form, files }).
   * logLines: [{ filename, lines: [...], partial }] from the attached logs, or { filename, failed: true } for one
   * that couldn't be read.
   */
  function devText(detail, logLines) {
    var t = detail.ticket;
    var a = t.answers || {};
    var out = [];
    var formName = detail.form ? detail.form.name : t.type;
    out.push(t.number + ' · ' + formName + ' · ' + t.summary);
    if (t.type !== 'bug') {
      // Feature ideas and setup questions: every answer, in the form's order.
      (detail.form ? detail.form.fields : []).forEach(function (f) {
        if (f.id === 'summary') return;
        var v = a[f.id];
        if (Array.isArray(v)) v = v.join('; ');
        if (v) out.push('', block(f.label.replace(/[?:]$/, ''), v));
      });
    } else {
      var s = parseSession(a.session);
      var split = splitExpected(a['what-happened']);
      out.push(
        '',
        block('Version', a.version),
        block('Track', s.track || (a.session ? '(see session)' : '')),
        block('Car', s.car || (a.session ? '(see session)' : '')),
        block('Session', a.session),
        '',
        block('Steps', a.steps),
        '',
        block('Expected', split.expected || (split.actual ? '(not said separately: see Actual)' : '')),
        block('Actual', split.actual),
        '',
        block('Frequency', a.frequency),
        block('Area', (a.area || []).join('; ')),
        block('Windows', a.os)
      );
      if (a.hardware) out.push(block('Hardware', a.hardware));
    }
    var logs = [];
    if (a.logs) logs.push('Pasted by the customer:\n' + String(a.logs).trim());
    (logLines || []).forEach(function (l) {
      if (l.failed) {
        logs.push(l.filename + ': couldn\'t be read (open it in the support admin under ' + t.number + ').');
        return;
      }
      if (!l.lines || !l.lines.length) {
        logs.push(l.filename + ': no lines that look like errors' + (l.partial ? ' in its last 1 MB' : '') + '.');
        return;
      }
      logs.push(l.filename + (l.partial ? ' (error lines from its last 1 MB):' : ' (error lines):') + '\n' + l.lines.join('\n'));
    });
    if (t.type === 'bug' || logs.length) {
      out.push('', 'companion.log lines:' + (logs.length ? '\n' + logs.join('\n\n') : ' (none given)'));
    }
    var files = detail.files || [];
    if (files.length) {
      out.push('', 'Files (private, in the support admin under ' + t.number + '):\n' + files.map(function (f) {
        return '- ' + f.filename + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)';
      }).join('\n'));
    }
    return out.join('\n');
  }

  root.GCDev = { parseSession: parseSession, splitExpected: splitExpected, devText: devText };
})(typeof window !== 'undefined' ? window : globalThis);
