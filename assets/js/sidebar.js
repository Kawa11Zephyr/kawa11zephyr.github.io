/* JavaDocs 21 — боковая панель: бургер-меню для мобильных
   и автопрокрутка к активному разделу. */
(function () {
  'use strict';

  var burger = document.getElementById('burger');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (!burger || !sidebar) return;

  function setOpen(open) {
    sidebar.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
  }

  burger.addEventListener('click', function (ev) {
    ev.stopPropagation();
    setOpen(!sidebar.classList.contains('open'));
  });
  if (overlay) overlay.addEventListener('click', function () { setOpen(false); });

  // Текущая страница — прокрутить сайдбар к активной ссылке
  var current = sidebar.querySelector('a.nav-link.current');
  if (current) current.scrollIntoView({ block: 'center', behavior: 'auto' });
})();
