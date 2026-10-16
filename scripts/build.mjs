// Builds the Cloudflare Pages version of the support site into dist/.
//
//   npm run build        (Cloudflare Pages: build command "npm run build", output directory "dist")
//
// It copies the static pages and the admin, and turns the training guide (guide/*.md) into HTML pages in the
// site's style. Nothing is fetched from the network. GitHub Pages doesn't use this: Jekyll builds the guide there.

import { Marked } from 'marked';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist');
const STATIC_FILES = ['index.html', 'report.html', 'privacy.html', '_headers'];
const STATIC_DIRS = ['admin'];
const SUPPORT_EMAIL = 'support.gridcentral@gmail.com';

// GitHub issue-form links in the guide go to our own form instead.
const ISSUE_LINKS = {
  'bug_report.yml': 'bug',
  'feature_request.yml': 'feature',
  'setup_help.yml': 'help'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c];
  });
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
}

// Like GitHub's heading anchors: "Installing with the Setup program" -> "installing-with-the-setup-program".
function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-') || 'section';
}

export function rewriteHref(href) {
  const md = /^([\w.-]+)\.md(#.*)?$/.exec(href);
  if (md) return (md[1] === 'README' ? './' : md[1] + '.html') + (md[2] || '');
  const issue = /^https:\/\/github\.com\/xr58ya\/grid-central-support\/issues\/new\?template=([\w.-]+)$/.exec(href);
  if (issue && ISSUE_LINKS[issue[1]]) return '../report.html?type=' + ISSUE_LINKS[issue[1]];
  return href;
}

/** Renders one guide page's Markdown. Returns { html, title, description, toc: [{ id, text }], rawHtml: [...] }. */
export function renderGuide(markdown) {
  const used = new Map();
  const toc = [];
  const rawHtml = [];
  let title = '';
  const marked = new Marked({ gfm: true });
  marked.use({
    walkTokens: function (token) {
      if (token.type === 'link') token.href = rewriteHref(token.href);
    },
    renderer: {
      heading: function (token) {
        const inner = this.parser.parseInline(token.tokens);
        const text = stripTags(inner);
        let id = slugify(text);
        const n = used.get(id) || 0;
        used.set(id, n + 1);
        if (n) id += '-' + n;
        if (token.depth === 1 && !title) title = text;
        if (token.depth === 2) toc.push({ id: id, text: text });
        return '<h' + token.depth + ' id="' + id + '">' + inner + '</h' + token.depth + '>\n';
      },
      // The guide has no HTML of its own: text like "Shared by <you>" is shown as written, not hidden as a tag.
      html: function (token) {
        rawHtml.push(token.text.trim());
        return escapeHtml(token.text);
      },
      link: function (token) {
        const inner = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//.test(token.href);
        return '<a href="' + escapeHtml(token.href) + '"' + (token.title ? ' title="' + escapeHtml(token.title) + '"' : '') +
          (external ? ' rel="noopener"' : '') + '>' + inner + '</a>';
      }
    }
  });
  const html = marked.parse(markdown);
  const firstPara = /<p>([\s\S]*?)<\/p>/.exec(html);
  let description = firstPara ? stripTags(firstPara[1]).replace(/\s+/g, ' ').trim() : '';
  if (description.length > 160) description = description.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return { html: html, title: title, description: description, toc: toc, rawHtml: rawHtml };
}

function header(home) {
  return `<header>
  <div class="wrap">
    <a class="home" href="${home}" aria-label="Grid Central Support home"><div class="logo" aria-hidden="true">GC</div><span class="wordmark">Grid Central<span>Support</span></span></a>
    <nav>
      <a href="${home}guide/">Training guide</a>
      <a href="${home}report.html">Get help</a>
    </nav>
  </div>
</header>`;
}

function footer(home) {
  return `<footer class="wrap">
  Something missing, wrong or unclear? <a href="${home}report.html?type=help">Ask for setup help</a> or email
  <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>. <a href="${home}privacy.html">Privacy</a>
</footer>`;
}

function page(opts) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
${opts.description ? `<meta name="description" content="${escapeHtml(opts.description)}">\n` : ''}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${opts.home}assets/guide.css">
</head>
<body>
${header(opts.home)}

<main class="wrap">
${opts.body}
</main>

${footer(opts.home)}
</body>
</html>
`;
}

function chapterPage(r, prev, next) {
  const toc = r.toc.length > 2
    ? `<nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ol>\n${r.toc.map(function (t) {
      return `  <li><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`;
    }).join('\n')}\n</ol></nav>\n`
    : '';
  const pager = prev || next
    ? `<nav class="pager" aria-label="Chapters">${prev ? `<a class="prev" href="${prev.href}"><span>Previous</span>${escapeHtml(prev.title)}</a>` : '<span></span>'}${next ? `<a class="next" href="${next.href}"><span>Next</span>${escapeHtml(next.title)}</a>` : ''}</nav>\n`
    : '';
  return `<p class="crumbs"><a href="../">Support</a> <span aria-hidden="true">›</span> <a href="./">Training guide</a></p>
<article class="doc">
${r.html.replace(/(<\/h1>\n)/, '$1' + toc)}</article>
${pager}`;
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(a, b);
    else await fs.copyFile(a, b);
  }
}

export async function build() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, 'guide'), { recursive: true });
  await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });

  for (const f of STATIC_FILES) await fs.copyFile(path.join(ROOT, f), path.join(OUT, f));
  for (const d of STATIC_DIRS) await copyDir(path.join(ROOT, d), path.join(OUT, d));
  await fs.copyFile(path.join(ROOT, 'scripts', 'guide.css'), path.join(OUT, 'assets', 'guide.css'));

  const guideDir = path.join(ROOT, 'guide');
  const names = (await fs.readdir(guideDir)).filter(function (n) { return n.endsWith('.md'); }).sort();
  const chapters = [];
  for (const name of names) {
    const md = await fs.readFile(path.join(guideDir, name), 'utf8');
    const r = renderGuide(md);
    if (r.rawHtml.length) console.log('  ' + name + ': shown as text, not HTML: ' + r.rawHtml.join(' '));
    const isIndex = name === 'README.md';
    chapters.push({ name: name, isIndex: isIndex, out: isIndex ? 'index.html' : name.replace(/\.md$/, '.html'), r: r });
  }
  const ordered = chapters.filter(function (c) { return !c.isIndex; });
  for (const c of chapters) {
    const i = ordered.indexOf(c);
    const link = function (o) { return o ? { href: o.out, title: o.r.title } : null; };
    const body = c.isIndex
      ? `<p class="crumbs"><a href="../">Support</a></p>\n<article class="doc">\n${c.r.html}</article>\n<nav class="pager" aria-label="Chapters"><span></span><a class="next" href="${ordered[0].out}"><span>Start here</span>${escapeHtml(ordered[0].r.title)}</a></nav>\n`
      : chapterPage(c.r, link(ordered[i - 1]), link(ordered[i + 1]));
    const html = page({ home: '../', title: c.r.title + ' · Grid Central Support', description: c.r.description, body: body });
    await fs.writeFile(path.join(OUT, 'guide', c.out), html);
  }

  // Without a 404 page, Cloudflare Pages would answer every unknown address with the home page.
  await fs.writeFile(path.join(OUT, '404.html'), page({
    home: '/',
    title: 'Page not found · Grid Central Support',
    body: '<article class="doc">\n<h1>Page not found</h1>\n<p>That page isn\'t here. Try the <a href="/">support home</a> or the <a href="/guide/">training guide</a>.</p>\n</article>'
  }));

  console.log('Built ' + path.relative(ROOT, OUT) + '/: ' + STATIC_FILES.length + ' pages and files, admin, ' + chapters.length + ' guide pages, 404 page.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch(function (err) {
    console.error(err);
    process.exit(1);
  });
}
