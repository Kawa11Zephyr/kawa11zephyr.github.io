/* JavaDocs 21 — кнопка «Копировать» для блоков кода. */
(function () {
  'use strict';

  var blocks = document.querySelectorAll('.code-block');
  blocks.forEach(function (block) {
    var code = block.querySelector('code');
    if (!code) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Копировать';
    btn.setAttribute('aria-label', 'Скопировать код');

    btn.addEventListener('click', function () {
      var text = code.innerText;
      function done(ok) {
        btn.textContent = ok ? '✓ Скопировано' : 'Ошибка';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Копировать';
          btn.classList.remove('copied');
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); },
                                                function () { done(fallback(text)); });
      } else {
        done(fallback(text));
      }
    });

    function fallback(text) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (e) { return false; }
    }

    block.appendChild(btn);
  });
})();
