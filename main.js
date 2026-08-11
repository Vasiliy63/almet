// ===== АЛМЕТ · минимальный JS =====
(function () {
  'use strict';

  // Год в подвале
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Мобильное меню
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Появление секций при скролле
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Лайтбокс галереи
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; }
  document.querySelectorAll('.gallery__item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lbImg.src = btn.getAttribute('data-src');
      lbImg.alt = (btn.querySelector('img') || {}).alt || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__close')) closeLb();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  // Отправка формы на почту через FormSubmit (без бэкенда)
  var form = document.getElementById('form');
  if (form) {
    var note = document.getElementById('form-note');
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn ? btn.textContent : '';

    // ── Куда отправлять заявки ─────────────────────────────────────
    // Сейчас указана почта — она нужна, чтобы активировать форму при
    // ПЕРВОЙ отправке (FormSubmit пришлёт письмо со ссылкой активации).
    // После активации на formsubmit.co вы получите зашифрованный alias —
    // короткую строку вида 'a1b2c3d4e5f6g7h8'. Впишите её сюда вместо
    // почты, и адрес больше нигде не будет виден:
    //     var FORM_TARGET = 'ВАШ_ALIAS';
    // Менять нужно только эту одну строку.
    var FORM_TARGET = 'zao@almetsamara.ru';
    // ───────────────────────────────────────────────────────────────
    var endpoint = 'https://formsubmit.co/ajax/' + FORM_TARGET;
    form.setAttribute('action', 'https://formsubmit.co/' + FORM_TARGET); // fallback без JS

    function showNote(msg, isError) {
      if (!note) return;
      note.textContent = msg;
      note.hidden = false;
      note.classList.toggle('form__note--error', !!isError);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var payload = {
        name: document.getElementById('f-name').value.trim(),
        phone: document.getElementById('f-phone').value.trim(),
        email: document.getElementById('f-email').value.trim(),
        message: document.getElementById('f-msg').value.trim(),
        _subject: 'Заявка с сайта ЗАО «АЛМЕТ»',
        _template: 'table'
      };

      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }
      if (note) { note.hidden = true; note.classList.remove('form__note--error'); }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showNote('Спасибо! Заявка отправлена — мы свяжемся с вами.', false);
            if (btn) btn.textContent = 'Отправлено';
          } else {
            throw new Error((res.d && res.d.message) || 'error');
          }
        })
        .catch(function () {
          showNote('Не удалось отправить. Позвоните нам: +7 (846) 979-77-77 или напишите на zao@almetsamara.ru', true);
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
    });
  }
})();
