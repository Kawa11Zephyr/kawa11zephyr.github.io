/* ============================================================
   JavaDocs 21 — клиентский поиск по документации.
   Загружает /search-index.json (относительный путь от корня
   сайта — важно для размещения в подкаталогах и для кэша CDN)
   и ищет по заголовкам, описаниям и ключевым словам.
   ============================================================ */
(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (!input || !results) return;

  // Корень сайта определяется из метатега (страницы лежат на разной глубине)
  var meta = document.querySelector('meta[name="docs-root"]');
  var ROOT = meta ? meta.getAttribute('content') : '';

  var INDEX_URL = ROOT + 'search-index.json';
  var index = null;      // данные индекса
  var indexLoading = null;

  function loadIndex() {
    if (indexLoading) return indexLoading;
    indexLoading = fetch(INDEX_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) { index = data; })
      .catch(function (e) {
        console.warn('Не удалось загрузить поисковый индекс:', e);
        index = [];
      });
    return indexLoading;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function score(entry, q) {
    var s = 0;
    var title = entry.t.toLowerCase();
    var desc = (entry.d || '').toLowerCase();
    var keys = (entry.k || []).join(' ').toLowerCase();
    if (title.indexOf(q) === 0) s += 100;
    if (title.indexOf(q) >= 0) s += 60;
    if (keys.indexOf(q) >= 0) s += 30;
    if (desc.indexOf(q) >= 0) s += 10;
    return s;
  }

  function search(q) {
    q = q.trim().toLowerCase();
    if (!index || q.length < 2) { close(); return; }
    var found = [];
    for (var i = 0; i < index.length; i++) {
      var s = score(index[i], q);
      if (s > 0) found.push({ e: index[i], s: s });
    }
    found.sort(function (a, b) { return b.s - a.s; });
    found = found.slice(0, 8);

    if (found.length === 0) {
      results.innerHTML = '<div class="sr-empty">Ничего не найдено по запросу «' + esc(q) + '»</div>';
    } else {
      results.innerHTML = found.map(function (f) {
        return '<a href="' + ROOT + f.e.u + '">' +
          '<span class="sr-section">' + esc(f.e.s) + '</span> ' +
          '<span class="sr-title">' + esc(f.e.t) + '</span>' +
          '<div class="sr-desc">' + esc(f.e.d || '') + '</div></a>';
      }).join('');
    }
    results.classList.add('open');
  }

  function close() { results.classList.remove('open'); }

  input.addEventListener('focus', function () { loadIndex(); if (input.value) search(input.value); });
  input.addEventListener('input', function () { search(input.value); });
  document.addEventListener('click', function (ev) {
    if (!results.contains(ev.target) && ev.target !== input) close();
  });
  document.addEventListener('keydown', function (ev) {
    // "/" или "s" — фокус на поиск (если не в поле ввода)
    var tag = (ev.target.tagName || '').toLowerCase();
    if ((ev.key === '/' || (ev.key === 's' && !ev.ctrlKey && !ev.metaKey)) &&
        tag !== 'input' && tag !== 'textarea') {
      ev.preventDefault();
      loadIndex();
      input.focus();
    }
    if (ev.key === 'Escape') { close(); input.blur(); }
  });
})();
