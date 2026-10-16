// "Copy for development": turns a ticket into the summary development asks for (see the source repository's
// CLAUDE.md, rule 4): version, track, car, session, steps, expected, actual, frequency and companion.log lines.
// Plain functions with no page access, so tests/run.mjs can check them in Node.
(function (root) {
  'use strict';

  // "Porsche 963 at Spa, team race" -> { car: "Porsche 963", track: "Spa", kind: "team race" }
  function parseSession(text) {
    var s = String(text || '').trim();
    var m = /^(.+?)\s+(?:at|@|on)\s+([^,;]+?)\s*(?:[,;]\s*(.+))?$/i.exec(s);
    if (!m) return { car: '', track: '', kind: '' };
    return { car: m[1].trim(), track: m[2].trim(), kind: (m[3] || '').trim() };
  }

  // The bug form asks for the problem and what was expected in one box. If the customer wrote "I expected ..."
  // or "It should ...", split it there; otherwise everything is the actual behaviour.
  function splitExpected(text) {
    var s = String(text || '').trim();
    var re = /(^|[.!?]\s+|\n\s*)((?:expected(?: result| behaviou?r)?\s*[:\-]|i(?:'d| would)? expect(?:ed)?\b|it should(?:n't| not)?\b|should have\b|instead,? it should\b)[\s\S]*)$/i;
    var m = re.exec(s);
    if (!m || m.index + m[1].length === 0) return { actual: s, expected: '' };
    var actual = s.slice(0, m.index + m[1].length).trim();
    var expected = m[2].replace(/^expected(?: result| behaviou?r)?\s*[:\-]\s*/i, '').trim();
    return { actual: actual, expected: expected };
  }

  function block(label, value) {
    var v = String(value == null ? '' : value).trim();
    if (!v) return label + ': (not given)';
    return v.indexOf('\n') >= 0 ? label + ':\n' + v : label + ': ' + v;
  }

  /**
   * detail: the ticket detail from /api/admin/tickets/<id> ({ ticket, form, files }).
   * logLines: [{ filename, lines: [...], partial }] from the attached logs.
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
