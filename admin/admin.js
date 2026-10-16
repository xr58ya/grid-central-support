// Grid Central Support admin. Every piece of ticket text goes into the page with textContent (never as HTML),
// so nothing a customer types can run here. The pages are /admin/#/ (the list) and /admin/#/GC-1001 (a ticket).
(function () {
  'use strict';

  var app = document.getElementById('app');
  var toastEl = document.getElementById('toast');
  var META = null;          // /api/admin/me: who's signed in, form labels, statuses
  var listState = null;     // the list's filters and tickets so far, for "Load more"; null when a ticket is shown
  var drafts = {};          // unsent reply and note text, by ticket number, so redrawing a ticket keeps it

  // ---- small helpers ----

  // h('div', { class: 'x', onclick: fn }, ['text', node]) builds an element. Strings always become text.
  function h(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (k === 'text') n.textContent = v;
      else if (k === 'value') n.value = v;
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, String(v));
    });
    (Array.isArray(children) ? children : children == null ? [] : [children]).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return n;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  var toastTimer = null;
  function toast(msg, bad) {
    toastEl.textContent = msg;
    toastEl.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = ''; }, bad ? 9000 : 4000);
  }

  function when(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  function kb(bytes) {
    return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function label(list, id) {
    var x = (list || []).find(function (i) { return i.id === id; });
    return x ? x.label : id;
  }

  function formOf(type) {
    return (META && META.forms || []).find(function (f) { return f.id === type; }) || { name: type, short: type, fields: [] };
  }

  // Calls the admin API. Throws { status, message, data } when it doesn't answer OK.
  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || 'GET', credentials: 'same-origin', redirect: 'manual', headers: { 'Accept': 'application/json' } };
    if (opts.body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(opts.body);
    }
    return fetch(path, init).then(function (res) {
      if (res.type === 'opaqueredirect' || res.status === 0) {
        throw { status: 401, message: 'Your sign-in has run out. Reload the page to sign in again.' };
      }
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { /* not JSON */ }
        if (!res.ok) throw { status: res.status, message: (data && (data.warning || data.error)) || 'The server answered ' + res.status + '.', data: data };
        return data;
      });
    }, function () {
      throw { status: 0, message: 'Couldn\'t reach the server. Check your connection, or reload the page to sign in again.' };
    });
  }

  function badge(kind, id, text) {
    return h('span', { 'class': 'badge ' + kind + '-' + id, text: text });
  }

  function typeBadge(type) { return badge('type', type, formOf(type).short); }
  function statusBadge(s) { return badge('st', s, label(META.statuses, s)); }
  function priorityBadge(p) { return p && p !== 'none' ? badge('pr', p, label(META.priorities, p)) : null; }

  function busy(btn, on, text) {
    btn.disabled = on;
    if (on) { btn.dataset.text = btn.textContent; btn.textContent = text || 'Working…'; } else if (btn.dataset.text) btn.textContent = btn.dataset.text;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error('no clipboard'));
  }

  // Copies text that's still being prepared. Safari and iPhones only allow copying during the click itself, so
  // where the browser can, the copy starts now and the text follows when it's ready.
  function copyWhenReady(textPromise) {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      try {
        var item = new window.ClipboardItem({ 'text/plain': textPromise.then(function (t) { return new Blob([t], { type: 'text/plain' }); }) });
        return navigator.clipboard.write([item]).catch(function () { return textPromise.then(copyText); });
      } catch (e) { /* this browser wants the text first */ }
    }
    return textPromise.then(copyText);
  }

  function showError(err) {
    clear(app);
    app.appendChild(h('div', { 'class': 'banner bad' }, err.message || String(err)));
    if (err.status === 401 || err.status === 403) {
      app.appendChild(h('p', { 'class': 'muted' }, [
        'The admin is only for the Grid Central team. If this is you, ',
        h('a', { href: location.pathname, onclick: function (e) { e.preventDefault(); location.reload(); } }, 'reload the page'),
        ' to sign in through Cloudflare Access again.'
      ]));
    }
  }

  // ---- routing ----

  function parseHash() {
    var raw = location.hash.replace(/^#\/?/, '');
    var q = raw.indexOf('?');
    var path = q >= 0 ? raw.slice(0, q) : raw;
    var params = new URLSearchParams(q >= 0 ? raw.slice(q + 1) : '');
    return { path: decodeURIComponent(path), params: params };
  }

  function route() {
    var r = parseHash();
    if (/^GC-\d+$/i.test(r.path)) showTicket(r.path.toUpperCase());
    else showList(r.params);
  }

  // Whether the page still shows this ticket (an answer that arrives after the owner has moved on is dropped).
  function showing(number) {
    return parseHash().path.toUpperCase() === number;
  }

  // ---- the ticket list ----

  var FILTERS = ['q', 'type', 'status', 'area', 'version', 'priority'];

  // The list's address keeps its filters, so Back from a ticket returns to the same list. No status means open.
  function listHash(v) {
    var p = new URLSearchParams();
    FILTERS.forEach(function (k) { if (v[k]) p.set(k, v[k]); });
    var s = p.toString();
    return '#/' + (s ? '?' + s : '');
  }

  function listFilters(params) {
    var f = {};
    FILTERS.forEach(function (k) { f[k] = params.get(k) || ''; });
    if (!params.has('status')) f.status = 'open';
    if (params.get('status') === 'all') f.status = '';
    return f;
  }

  function setupBanners() {
    var s = META.setup || {};
    var out = [];
    if (!s.email) out.push('Email isn\'t set up (RESEND_API_KEY): customers get no confirmation and replies can\'t be sent.');
    if (!s.ownerEmail) out.push('OWNER_EMAIL isn\'t set: you won\'t be emailed about new tickets.');
    if (!s.turnstile) out.push('Turnstile isn\'t set up (TURNSTILE_SITE_KEY, TURNSTILE_SECRET): the report form can\'t send.');
    if (!s.files) out.push('File storage isn\'t set up (FILES): the form won\'t accept attachments.');
    return out.map(function (m) { return h('div', { 'class': 'banner' }, m); });
  }

  function select(name, value, first, options) {
    var s = h('select', { name: name });
    s.appendChild(h('option', { value: '' }, first));
    options.forEach(function (o) {
      var opt = h('option', { value: o.id }, o.label);
      if (o.id === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }

  function showList(params) {
    document.title = 'Tickets · Grid Central Support admin';
    var f = listFilters(params);

    clear(app);
    setupBanners().forEach(function (b) { app.appendChild(b); });
    app.appendChild(h('h1', null, 'Tickets'));

    var search = h('input', { type: 'search', name: 'q', value: f.q, placeholder: 'GC-1001, words, an email…' });
    var version = h('input', { type: 'text', name: 'version', value: f.version, placeholder: '0.5.9.2' });
    var typeSel = select('type', f.type, 'All types', (META.forms || []).map(function (x) { return { id: x.id, label: x.name }; }));
    var statusSel = select('status', f.status === 'open' ? 'open' : f.status, 'Every status',
      [{ id: 'open', label: 'Open (not closed)' }].concat(META.statuses));
    var areaSel = select('area', f.area, 'All areas', (META.areas || []).map(function (a) { return { id: a, label: a }; }));
    var prioSel = select('priority', f.priority, 'Any priority', META.priorities);

    // Filters change the results only: the form stays as it is, so the box being typed in keeps its focus and
    // text. replaceState updates the address without a hashchange (and without a history entry per pause).
    function apply() {
      if (!bar.isConnected) return; // a ticket was opened before the typing pause ended
      var target = listHash({
        q: search.value.trim(), type: typeSel.value, status: statusSel.value || 'all', area: areaSel.value,
        version: version.value.trim(), priority: prioSel.value
      });
      if (location.hash !== target) history.replaceState(null, '', target);
      loadList(listFilters(parseHash().params));
    }
    var timer = null;
    function later() { clearTimeout(timer); timer = setTimeout(apply, 450); }
    search.addEventListener('input', later);
    version.addEventListener('input', later);
    [typeSel, statusSel, areaSel, prioSel].forEach(function (s) { s.addEventListener('change', apply); });

    var bar = h('form', { 'class': 'filters', role: 'search', onsubmit: function (e) { e.preventDefault(); apply(); } }, [
      h('label', null, ['Search', search]),
      h('label', null, ['Type', typeSel]),
      h('label', null, ['Status', statusSel]),
      h('label', null, ['Area', areaSel]),
      h('label', null, ['Version', version]),
      h('label', null, ['Priority', prioSel])
    ]);
    app.appendChild(bar);
    var chips = h('div', { 'class': 'chips', 'aria-label': 'Status' });
    app.appendChild(chips);
    var holder = h('div', null, h('p', { 'class': 'muted' }, 'Loading…'));
    app.appendChild(holder);

    function loadList(filters) {
      listState = { filters: filters, tickets: [], holder: holder, chips: chips, statusSel: statusSel };
      loadPage(listState, null);
    }
    loadList(f);
  }

  function query(f, before) {
    var p = new URLSearchParams();
    FILTERS.forEach(function (k) { if (f[k]) p.set(k, f[k]); });
    if (before) p.set('before', String(before));
    return '/api/admin/tickets?' + p.toString();
  }

  // One page of the list. "Load more" asks for the tickets numbered below the last one shown, so a ticket that
  // arrives or goes in between can't make one show twice or go missing.
  function loadPage(state, before) {
    var holder = state.holder;
    api(query(state.filters, before)).then(function (data) {
      if (state !== listState) return; // the filters changed, or a ticket was opened, while this was loading
      drawChips(state.chips, data.counts || {}, state.filters, state.statusSel);
      state.tickets = state.tickets.concat(data.tickets);
      clear(holder);
      if (!state.tickets.length) {
        var empty = h('div', { 'class': 'empty' }, state.filters.status === 'open' ? 'No open tickets match.' : 'No tickets match.');
        if (state.filters.status) {
          // A search for a closed ticket (by number or email) is hidden by the status filter: offer to look wider.
          empty.appendChild(h('p', null, h('button', {
            'class': 'btn secondary', type: 'button',
            onclick: function () { state.statusSel.value = ''; state.statusSel.dispatchEvent(new Event('change')); }
          }, 'Search every status')));
        }
        holder.appendChild(empty);
        return;
      }
      holder.appendChild(drawTable(state.tickets));
      if (data.more) {
        var btn = h('button', { 'class': 'btn secondary', type: 'button' }, 'Load more');
        btn.addEventListener('click', function () {
          busy(btn, true, 'Loading…');
          loadPage(state, state.tickets[state.tickets.length - 1].id);
        });
        holder.appendChild(h('div', { 'class': 'more' }, btn));
      }
    }).catch(function (err) {
      if (state !== listState) return;
      if (err.status === 401 || err.status === 403 || err.status === 0) showError(err);
      else { clear(holder); holder.appendChild(h('div', { 'class': 'banner bad' }, err.message)); }
    });
  }

  function drawChips(chips, counts, f, statusSel) {
    clear(chips);
    chips.appendChild(h('span', { 'class': 'chips-label' }, 'All tickets:'));
    var open = 0, all = 0;
    META.statuses.forEach(function (s) { all += counts[s.id] || 0; if (s.id !== 'closed') open += counts[s.id] || 0; });
    var items = [{ id: 'open', label: 'Open', n: open }].concat(META.statuses.map(function (s) {
      return { id: s.id, label: s.label, n: counts[s.id] || 0 };
    })).concat([{ id: 'all', label: 'All', n: all }]);
    items.forEach(function (it) {
      var on = (f.status || 'all') === it.id;
      chips.appendChild(h('button', {
        type: 'button', 'aria-pressed': String(on),
        onclick: function () {
          statusSel.value = it.id === 'all' ? '' : it.id;
          statusSel.dispatchEvent(new Event('change'));
        }
      }, it.label + ' ' + it.n));
    });
  }

  function drawTable(tickets) {
    var body = h('tbody');
    tickets.forEach(function (t) {
      var href = '#/' + encodeURIComponent(t.number);
      var tr = h('tr', { onclick: function (e) { if (e.target.tagName !== 'A') location.hash = href; } }, [
        h('td', { 'class': 'num' }, h('a', { href: href }, t.number)),
        h('td', null, [typeBadge(t.type)]),
        h('td', null, [statusBadge(t.status), ' ', priorityBadge(t.priority)]),
        h('td', { 'class': 'sum' }, [
          h('div', null, t.summary),
          h('div', { 'class': 'email' }, t.email + (t.fileCount ? ' · ' + t.fileCount + (t.fileCount === 1 ? ' file' : ' files') : ''))
        ]),
        h('td', { 'class': 'small' }, t.version || '–'),
        h('td', { 'class': 'small muted' }, (t.areas || []).join(', ')),
        h('td', { 'class': 'when' }, when(t.createdAt))
      ]);
      body.appendChild(tr);
    });
    return h('table', { 'class': 'list' }, [
      h('thead', null, h('tr', null, ['Ticket', 'Type', 'Status', 'Summary', 'Version', 'Area', 'Sent'].map(function (c) {
        return h('th', { scope: 'col' }, c);
      }))),
      body
    ]);
  }

  // ---- one ticket ----

  function showTicket(number) {
    listState = null;
    document.title = number + ' · Grid Central Support admin';
    clear(app);
    app.appendChild(h('a', { 'class': 'back', href: '#/' }, '← All tickets'));
    app.appendChild(h('p', { 'class': 'muted' }, 'Loading ' + number + '…'));
    api('/api/admin/tickets/' + encodeURIComponent(number)).then(drawTicket, function (err) {
      if (showing(number)) showError(err);
    });
  }

  function draftOf(number) {
    if (!drafts[number]) drafts[number] = { reply: '', note: '' };
    return drafts[number];
  }

  function drawTicket(d) {
    var t = d.ticket;
    if (!showing(t.number)) return; // the owner has gone to the list or another ticket meanwhile
    var form = d.form || formOf(t.type);
    document.title = t.number + ' · ' + t.summary + ' · Grid Central Support admin';
    clear(app);
    app.appendChild(h('a', { 'class': 'back', href: '#/' }, '← All tickets'));
    if (d.warning) app.appendChild(h('div', { 'class': 'banner bad' }, d.warning));
    app.appendChild(h('div', { 'class': 'title-row' }, [
      h('h1', null, [h('span', { 'class': 'num' }, t.number), ' ', t.summary]),
      typeBadge(t.type), statusBadge(t.status), priorityBadge(t.priority)
    ]));
    app.appendChild(h('div', { 'class': 'meta' }, [
      h('span', null, ['From ', h('b', null, t.email)]),
      h('span', null, ['Sent ', h('b', null, when(t.createdAt))]),
      t.version ? h('span', null, ['Version ', h('b', null, t.version)]) : null,
      h('span', null, ['Updated ', when(t.updatedAt)])
    ]));

    var main = h('div', { 'class': 'main' });
    var side = h('div', { 'class': 'side' });
    app.appendChild(h('div', { 'class': 'detail' }, [main, side]));

    // Answers
    var answers = h('div', { 'class': 'answers' });
    form.fields.forEach(function (f) {
      if (f.id === 'summary') return;
      var v = t.answers ? t.answers[f.id] : null;
      if (Array.isArray(v)) v = v.join('; ');
      answers.appendChild(h('div', { 'class': 'answer' + (f.id === 'logs' ? ' code' : '') }, [
        h('div', { 'class': 'q' }, f.label),
        h('div', { 'class': 'a' + (v ? '' : ' none') }, v || 'Not answered')
      ]));
    });
    main.appendChild(h('section', { 'class': 'card' }, [h('h2', null, form.name), answers]));

    // Files
    if (d.files.length) {
      var list = h('ul', { 'class': 'files' });
      d.files.forEach(function (f) { list.appendChild(fileItem(f)); });
      main.appendChild(h('section', { 'class': 'card' }, [h('h2', null, 'Files (' + d.files.length + ')'), list]));
    }

    // History
    var hist = h('ol', { 'class': 'history' });
    d.events.forEach(function (e) { hist.appendChild(eventItem(e)); });
    main.appendChild(h('section', { 'class': 'card' }, [h('h2', null, 'History'), hist]));

    // Reply and note
    main.appendChild(replyCard(t));
    main.appendChild(noteCard(t));

    // Side: status, development, delete
    side.appendChild(statusCard(t));
    side.appendChild(devCard(d));
    side.appendChild(deleteCard(t));
  }

  function fileItem(f) {
    var url = '/api/admin/files/' + encodeURIComponent(f.id);
    var li = h('li', null, h('div', { 'class': 'row' }, [
      h('span', { 'class': 'name' }, f.filename),
      h('span', { 'class': 'muted small' }, kb(f.size) + ' · ' + f.kind),
      h('a', { 'class': 'btn secondary', href: url, download: f.filename }, 'Download')
    ]));
    if (f.kind === 'image') {
      li.appendChild(h('a', { href: url + '?inline=1', target: '_blank', rel: 'noopener' },
        h('img', { src: url + '?inline=1', alt: 'Screenshot ' + f.filename, loading: 'lazy' })));
    }
    if (f.kind === 'log') {
      var out = h('div');
      var btn = h('button', { 'class': 'btn ghost', type: 'button' }, 'Show error lines');
      btn.addEventListener('click', function () {
        busy(btn, true, 'Reading…');
        api(url + '?lines=errors').then(function (r) {
          clear(out);
          out.appendChild(h('pre', null, r.lines.length ? r.lines.join('\n') : 'No lines that look like errors' + (r.partial ? ' in the last 1 MB.' : '.')));
          btn.remove();
        }).catch(function (err) { busy(btn, false); toast(err.message, true); });
      });
      li.firstChild.appendChild(btn);
      li.appendChild(out);
    }
    return li;
  }

  function eventItem(e) {
    var m = e.meta || {};
    var who = e.actor === 'customer' ? 'Customer' : e.actor === 'system' ? 'System' : e.actor;
    var what = [];
    var cls = e.kind;
    if (e.kind === 'created') what.push('Ticket sent');
    else if (e.kind === 'email') {
      what.push(m.to === 'owner' ? 'New-ticket email to you' : 'Confirmation email to the customer');
      what.push(m.ok ? h('span', { 'class': 'badge ok' }, 'sent') : h('span', { 'class': 'badge bad' }, 'failed'));
      if (!m.ok) cls += ' failed';
    } else if (e.kind === 'status') {
      what.push('Status: ' + label(META.statuses, m.from) + ' → ' + label(META.statuses, m.to));
      if (m.notified) {
        what.push(m.ok ? h('span', { 'class': 'badge ok' }, 'customer emailed') : h('span', { 'class': 'badge bad' }, 'email failed'));
        if (!m.ok) cls += ' failed';
      }
    } else if (e.kind === 'priority') what.push('Priority: ' + label(META.priorities, m.from) + ' → ' + label(META.priorities, m.to));
    else if (e.kind === 'note') what.push(h('span', { 'class': 'badge note' }, 'Private note'));
    else if (e.kind === 'reply') {
      what.push('Reply to the customer');
      what.push(m.ok ? h('span', { 'class': 'badge ok' }, 'emailed') : h('span', { 'class': 'badge bad' }, 'not sent'));
      if (!m.ok) cls += ' failed';
    } else if (e.kind === 'file') {
      what.push('File ' + (m.filename || '') + (m.ok === false ? ' couldn\'t be saved' : ''));
      cls += ' failed';
    } else what.push(e.kind);
    return h('li', { 'class': cls }, [
      h('div', { 'class': 'when' }, when(e.at) + ' · ' + who),
      h('div', { 'class': 'what' }, what),
      e.body ? h('div', { 'class': 'body' }, e.body) : null,
      m.error ? h('div', { 'class': 'err' }, m.error) : null
    ]);
  }

  function replyCard(t) {
    var draft = draftOf(t.number);
    var text = h('textarea', { rows: 6, value: draft.reply, placeholder: 'Write to the customer. It\'s emailed to ' + t.email + ' and kept in the history.' });
    text.addEventListener('input', function () { draft.reply = text.value; });
    var btn = h('button', { 'class': 'btn', type: 'button' }, 'Email reply to customer');
    btn.addEventListener('click', function () {
      var body = text.value.trim();
      if (!body) { toast('Write the reply first.', true); text.focus(); return; }
      if (!confirm('Email this reply to ' + t.email + '?')) return;
      busy(btn, true, 'Sending…');
      api('/api/admin/tickets/' + encodeURIComponent(t.number) + '/reply', { method: 'POST', body: { body: body } }).then(function (d) {
        draft.reply = '';
        toast('Reply emailed to ' + t.email + '.');
        drawTicket(d);
      }).catch(function (err) {
        busy(btn, false);
        // A reply that didn't go is still saved in the history, to copy and send again.
        if (err.data && err.data.ticket) { draft.reply = ''; drawTicket(err.data); }
        toast(err.message, true);
      });
    });
    return h('section', { 'class': 'card' }, [h('h2', null, 'Reply'), h('div', { 'class': 'stack' }, [text, h('div', { 'class': 'row-actions' }, btn)])]);
  }

  function noteCard(t) {
    var draft = draftOf(t.number);
    var text = h('textarea', { rows: 3, value: draft.note, placeholder: 'Only the Grid Central team sees notes. They are never emailed.' });
    text.addEventListener('input', function () { draft.note = text.value; });
    var btn = h('button', { 'class': 'btn secondary', type: 'button' }, 'Add private note');
    btn.addEventListener('click', function () {
      var body = text.value.trim();
      if (!body) { toast('Write the note first.', true); text.focus(); return; }
      busy(btn, true, 'Saving…');
      api('/api/admin/tickets/' + encodeURIComponent(t.number) + '/notes', { method: 'POST', body: { body: body } }).then(function (d) {
        draft.note = '';
        toast('Note added.');
        drawTicket(d);
      }).catch(function (err) { busy(btn, false); toast(err.message, true); });
    });
    return h('section', { 'class': 'card' }, [h('h2', null, 'Private note'), h('div', { 'class': 'stack' }, [text, h('div', { 'class': 'row-actions' }, btn)])]);
  }

  function statusCard(t) {
    var status = select('status', t.status, 'Status', META.statuses);
    status.firstChild.remove();
    var prio = select('priority', t.priority, 'Priority', META.priorities);
    prio.firstChild.remove();
    var prioHint = h('span', { 'class': 'muted small' });
    function showPrioHint() {
      var p = META.priorities.find(function (x) { return x.id === prio.value; });
      prioHint.textContent = p && p.hint ? p.hint : '';
    }
    prio.addEventListener('change', showPrioHint);
    showPrioHint();
    var notify = h('input', { type: 'checkbox' });
    var message = h('textarea', { rows: 4, placeholder: 'Optional message for the customer, for example what you need from them.' });
    var msgWrap = h('label', { 'class': 'hidden' }, ['Message in the email', message]);
    function sync() {
      var changed = status.value !== t.status;
      notify.disabled = !changed;
      if (!changed) notify.checked = false;
      msgWrap.classList.toggle('hidden', !notify.checked);
    }
    status.addEventListener('change', sync);
    notify.addEventListener('change', sync);
    sync();
    var btn = h('button', { 'class': 'btn', type: 'button' }, 'Save');
    btn.addEventListener('click', function () {
      if (status.value === t.status && prio.value === t.priority) { toast('Nothing changed.'); return; }
      if (notify.checked && !confirm('Email ' + t.email + ' that ' + t.number + ' is now "' + label(META.statuses, status.value) + '"?')) return;
      busy(btn, true, 'Saving…');
      // Only what changed here, with what the page showed, so a change made elsewhere is never undone.
      var body = { notify: notify.checked, message: message.value, from: { status: t.status, priority: t.priority } };
      if (status.value !== t.status) body.status = status.value;
      if (prio.value !== t.priority) body.priority = prio.value;
      api('/api/admin/tickets/' + encodeURIComponent(t.number), { method: 'PATCH', body: body }).then(function (d) {
        toast(d.warning ? d.warning : 'Saved.' + (notify.checked ? ' The customer has been emailed.' : ''), !!d.warning);
        drawTicket(d);
      }).catch(function (err) { busy(btn, false); toast(err.message, true); });
    });
    return h('section', { 'class': 'card' }, [
      h('h2', null, 'Status'),
      h('div', { 'class': 'stack' }, [
        h('label', null, ['Status', status]),
        h('label', null, ['Priority', prio, prioHint]),
        h('label', { 'class': 'check' }, [notify, 'Email the customer about the new status']),
        msgWrap,
        h('div', { 'class': 'row-actions' }, btn)
      ])
    ]);
  }

  function devCard(d) {
    var t = d.ticket;
    var area = h('textarea', { 'class': 'mono', rows: 16, 'aria-label': 'Summary for development' });
    var panel = h('div', { 'class': 'stack dev hidden' }, [
      h('p', { 'class': 'muted small' }, 'Check the track, car, expected and actual lines, edit anything here, then press Copy again.'),
      area
    ]);
    var copyAgain = h('button', { 'class': 'btn secondary hidden', type: 'button' }, 'Copy again');
    var btn = h('button', { 'class': 'btn', type: 'button' }, 'Copy for development');
    var problems = [];
    function copied(ok) {
      if (!ok) {
        area.focus();
        area.setSelectionRange(0, area.value.length);
        toast('Couldn\'t copy automatically. Press Copy again, or copy the text below yourself.', true);
      } else if (problems.length) {
        toast('Copied, but ' + problems.join(' ') + (problems.length > 1 ? ' Their' : ' Its') + ' lines are missing from the text.', true);
      } else {
        toast('Copied. Paste it to development.');
      }
    }
    btn.addEventListener('click', function () {
      busy(btn, true, 'Reading logs…');
      problems = [];
      var logs = d.files.filter(function (f) { return f.kind === 'log'; });
      var ready = Promise.all(logs.map(function (f) {
        return api('/api/admin/files/' + encodeURIComponent(f.id) + '?lines=errors').catch(function (err) {
          problems.push(f.filename + ' couldn\'t be read: ' + err.message);
          return { filename: f.filename, failed: true };
        });
      })).then(function (lines) {
        busy(btn, false);
        area.value = window.GCDev.devText(d, lines);
        panel.classList.remove('hidden');
        copyAgain.classList.remove('hidden');
        // From now on Copy again copies the text as edited here; making it again would throw the edits away.
        btn.classList.add('hidden');
        return area.value;
      });
      copyWhenReady(ready).then(function () { copied(true); }, function () { copied(false); });
    });
    copyAgain.addEventListener('click', function () {
      copyText(area.value).then(function () { copied(true); }, function () { copied(false); });
    });
    return h('section', { 'class': 'card' }, [
      h('h2', null, 'Development'),
      h('p', { 'class': 'muted small' }, 'A summary to pass on: version, track, car, session, steps, expected, actual, how often, and companion.log lines.'),
      h('div', { 'class': 'row-actions' }, [btn, copyAgain]),
      panel
    ]);
  }

  function deleteCard(t) {
    var btn = h('button', { 'class': 'btn danger', type: 'button' }, 'Delete ticket…');
    btn.addEventListener('click', function () {
      var typed = prompt('This deletes ' + t.number + ', its history and its files for good (for example when the customer asks).\n\n' +
        'It can\'t delete the emails about it: afterwards, search your inbox for ' + t.number + ' and delete those too.\n\nType ' + t.number + ' to delete it.');
      if (typed == null) return;
      if (typed.trim().toUpperCase() !== t.number) { toast('Not deleted: the number didn\'t match.', true); return; }
      busy(btn, true, 'Deleting…');
      api('/api/admin/tickets/' + encodeURIComponent(t.number), { method: 'DELETE', body: { confirm: t.number } }).then(function () {
        delete drafts[t.number];
        toast(t.number + ' deleted. Now search your inbox for ' + t.number + ' and delete the emails about it.');
        location.hash = '#/';
      }).catch(function (err) { busy(btn, false); toast(err.message, true); });
    });
    return h('section', { 'class': 'card' }, [
      h('h2', null, 'Delete'),
      h('p', { 'class': 'muted small' }, 'Only when the customer asks for their data to be removed, or for spam.'),
      btn
    ]);
  }

  // ---- start ----

  api('/api/admin/me').then(function (me) {
    META = me;
    document.getElementById('me').textContent = me.email;
    window.addEventListener('hashchange', route);
    route();
  }).catch(showError);
})();
