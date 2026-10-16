// The three copies of the forms must agree: report.html (what people fill in), lib/forms.js (what the server
// accepts) and .github/ISSUE_TEMPLATE/*.yml (the GitHub forms, whose field ids the web form keeps).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { FORMS } from '../lib/forms.js';
import { ROOT } from './helpers.mjs';

function pageForms() {
  const html = fs.readFileSync(path.join(ROOT, 'report.html'), 'utf8');
  const m = /\/\/ FORMS:start[^\n]*\n([\s\S]*?)\/\/ FORMS:end/.exec(html);
  assert.ok(m, 'report.html has the FORMS:start / FORMS:end markers');
  return new Function('EMAIL', m[1] + '\nreturn FORMS;')('support.gridcentral@gmail.com');
}

// Just enough YAML reading for the issue forms: each body item's type, id, options and required flag.
function ymlFields(file) {
  const text = fs.readFileSync(path.join(ROOT, '.github', 'ISSUE_TEMPLATE', file), 'utf8');
  return text.split(/\n  - type: /).slice(1).map(function (chunk) {
    const type = chunk.split('\n')[0].trim();
    const id = (/\n    id: (\S+)/.exec(chunk) || [])[1];
    const options = [];
    const om = /\n      options:\n((?:        - .*\n?)+)/.exec(chunk);
    if (om) om[1].trim().split('\n').forEach(function (l) { options.push(l.replace(/^\s*- /, '').trim()); });
    return { type: type, id: id, required: /\n      required: true/.test(chunk), options: options };
  }).filter(function (f) { return f.id; });
}

const YML = { bug: 'bug_report.yml', feature: 'feature_request.yml', help: 'setup_help.yml' };
const TYPE_MAP = { input: 'input', textarea: 'textarea', dropdown: ['select', 'multi'] };

test('report.html and lib/forms.js have the same forms', function () {
  const page = pageForms();
  assert.deepEqual(Object.keys(page).sort(), Object.keys(FORMS).sort());
  for (const type of Object.keys(FORMS)) {
    const a = page[type].fields.map(function (f) { return { id: f.id, type: f.type, label: f.label, required: !!f.required, options: f.options || null }; });
    const b = FORMS[type].fields.map(function (f) { return { id: f.id, type: f.type, label: f.label, required: !!f.required, options: f.options || null }; });
    assert.deepEqual(a, b, type);
  }
});

test('the web forms keep the GitHub issue forms\' field ids, required answers and options', function () {
  for (const type of Object.keys(YML)) {
    const yml = ymlFields(YML[type]);
    const web = FORMS[type].fields;
    // GitHub uses the issue title for the summary; the web form's file attachments replace "screenshots".
    const webIds = web.map(function (f) { return f.id; }).filter(function (id) { return id !== 'summary'; });
    const ymlIds = yml.map(function (f) { return f.id; }).filter(function (id) { return id !== 'screenshots'; });
    assert.deepEqual(webIds, ymlIds, type + ' field ids, in order');
    for (const y of yml) {
      const w = web.find(function (f) { return f.id === y.id; });
      if (!w) continue;
      const allowed = [].concat(TYPE_MAP[y.type]);
      assert.ok(allowed.indexOf(w.type) >= 0, type + '.' + y.id + ' type ' + w.type + ' vs ' + y.type);
      assert.equal(!!w.required, y.required, type + '.' + y.id + ' required');
      if (y.options.length) assert.deepEqual(w.options, y.options, type + '.' + y.id + ' options');
    }
  }
});
