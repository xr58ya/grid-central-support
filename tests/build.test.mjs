// The Cloudflare Pages build: guide pages in the site style, links that work, nothing that GitHub Pages needs moved.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build, renderGuide, rewriteHref } from '../scripts/build.mjs';
import { ROOT } from './helpers.mjs';

test('guide Markdown: headings get anchors, raw tags show as text, links point at the built pages', function () {
  const r = renderGuide('# Title\n\nShared by <you> in `<code>`.\n\n## A & B\n\n## A & B\n\n[next](02-x.md#part) [home](README.md) ' +
    '[help](https://github.com/xr58ya/grid-central-support/issues/new?template=setup_help.yml) [out](https://example.com)\n');
  assert.equal(r.title, 'Title');
  assert.match(r.html, /Shared by &lt;you&gt; in <code>&lt;code&gt;<\/code>/);
  assert.match(r.html, /<h2 id="a--b">A &amp; B<\/h2>/);
  assert.match(r.html, /<h2 id="a--b-1">/);
  assert.match(r.html, /href="02-x\.html#part"/);
  assert.match(r.html, /href="\.\/"/);
  assert.match(r.html, /href="\.\.\/report\.html\?type=help"/);
  assert.match(r.html, /href="https:\/\/example\.com" rel="noopener"/);
  assert.deepEqual(r.toc.map(function (t) { return t.id; }), ['a--b', 'a--b-1']);
  assert.equal(rewriteHref('https://github.com/xr58ya/grid-central-support/issues/new?template=bug_report.yml'), '../report.html?type=bug');
});

test('npm run build writes every page, and every link between them works', async function () {
  await build();
  const dist = path.join(ROOT, 'dist');
  const expect = ['index.html', 'report.html', 'privacy.html', '404.html', '_headers', 'admin/index.html', 'admin/admin.js',
    'admin/devtext.js', 'admin/admin.css', 'assets/guide.css', 'guide/index.html', 'guide/01-getting-started.html', 'guide/06-paint-shop.html'];
  for (const f of expect) assert.ok(fs.existsSync(path.join(dist, f)), f);
  assert.equal(fs.existsSync(path.join(dist, 'functions')), false, 'the API is not copied into the static files');

  // Every relative link and asset in the built pages points at a file that exists.
  const pages = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p); else if (p.endsWith('.html')) pages.push(p);
    }
  })(dist);
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    const refs = Array.from(html.matchAll(/(?:href|src)="([^"#?]*)(?:[?#][^"]*)?"/g)).map(function (m) { return m[1]; });
    for (const ref of refs) {
      if (!ref || /^(https?:|mailto:)/.test(ref)) continue;
      let target = ref.startsWith('/') ? path.join(dist, ref) : path.resolve(path.dirname(page), ref);
      if (ref.endsWith('/')) target = path.join(target, 'index.html');
      assert.ok(fs.existsSync(target), path.relative(dist, page) + ' links to missing ' + ref);
    }
  }
  const guide = fs.readFileSync(path.join(dist, 'guide', '01-getting-started.html'), 'utf8');
  assert.match(guide, /<span class="wordmark">Grid Central<span>Support<\/span><\/span>/);
  assert.match(guide, /family=Space\+Grotesk/);
  assert.match(fs.readFileSync(path.join(dist, 'assets', 'guide.css'), 'utf8'), /--accent: #d2ff50/);
});

test('GitHub Pages leaves the Cloudflare-only files out', function () {
  const config = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
  for (const p of ['admin/', 'functions/', 'lib/', 'migrations/', 'scripts/', 'support/', 'tests/', 'node_modules/', 'package.json', 'wrangler.toml']) {
    assert.ok(config.indexOf('  - ' + p + '\n') >= 0, p);
  }
});

test('no secrets, beta codes or private addresses in the files that get published', function () {
  const files = ['wrangler.toml', 'report.html', 'privacy.html', 'index.html', '_headers', 'admin/admin.js', 'admin/index.html',
    'lib/email.js', 'support/cloudflare-setup.md', 'README.md'];
  for (const f of files) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.doesNotMatch(text, /\bre_[A-Za-z0-9]{16,}/, f + ': Resend key');
    assert.doesNotMatch(text, /\b0x4[A-Za-z0-9_-]{20,}/, f + ': Turnstile secret');
    assert.doesNotMatch(text.replace(/GC-XXXX-XXXX-XXXX/g, ''), /GC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/, f + ': beta code');
    const emails = Array.from(text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)).map(function (m) { return m[0]; });
    for (const e of emails) {
      assert.ok(/^(support\.gridcentral@gmail\.com|support@gridcentral\.store|you@example\.com)$/.test(e), f + ': ' + e);
    }
  }
});
