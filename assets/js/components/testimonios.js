/* ==========================================================================
   WHITE SHARK CONSULTING — components/testimonios.js
   Carga los testimonios desde assets/data/testimonios.json.
   - La sección arranca oculta ([hidden]) y solo se muestra si hay testimonios
     para el idioma de la página. Con el JSON vacío ([]) no deja ningún hueco.
   - Campos: nombre, cargo, empresa, texto, foto (opcional), idioma ("es" | "en").
   ========================================================================== */
(function () {
  'use strict';

  var section = document.querySelector('[data-testimonios]');
  if (!section || !window.fetch) return;

  var src = section.getAttribute('data-src');
  var base = section.getAttribute('data-base') || '';
  var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);
  var track = section.querySelector('[data-t-track]');
  var prev = section.querySelector('[data-t-prev]');
  var next = section.querySelector('[data-t-next]');
  var controls = section.querySelector('[data-t-controls]');

  fetch(src, { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (data) {
      if (!Array.isArray(data)) return;
      var items = data.filter(function (t) {
        return t && t.texto && t.nombre && (!t.idioma || t.idioma === lang);
      });
      if (!items.length) return; // Sin testimonios: la sección sigue oculta
      render(items);
      section.hidden = false;
      setupSlider();
    })
    .catch(function () { /* Si falla la carga, la sección permanece oculta */ });

  /* ------------------------------------------------------------------------
     Pintado de tarjetas (textContent: a prueba de inyección de HTML)
     ------------------------------------------------------------------------ */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function quoteIcon() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'icon t-card__quote-mark');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z');
    svg.appendChild(p);
    return svg;
  }

  function render(items) {
    items.forEach(function (t) {
      var li = el('li');
      var fig = el('figure', 't-card');
      fig.appendChild(quoteIcon());

      var bq = el('blockquote');
      bq.appendChild(el('p', null, t.texto));
      fig.appendChild(bq);

      var cap = el('figcaption');
      if (t.foto) {
        var img = el('img', 't-card__photo');
        img.src = /^https?:\/\//.test(t.foto) ? t.foto : base + t.foto;
        img.alt = t.nombre;
        img.width = 52;
        img.height = 52;
        img.loading = 'lazy';
        img.decoding = 'async';
        cap.appendChild(img);
      }
      var who = el('div');
      who.appendChild(el('span', 't-card__name', t.nombre));
      var role = [t.cargo, t.empresa].filter(Boolean).join(' · ');
      if (role) who.appendChild(el('span', 't-card__role', role));
      cap.appendChild(who);
      fig.appendChild(cap);

      li.appendChild(fig);
      track.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------------
     Slider: desplazamiento con scroll-snap, botones y avance automático
     ------------------------------------------------------------------------ */
  function setupSlider() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null;

    function pageWidth() { return track.clientWidth; }
    function atStart() { return track.scrollLeft <= 4; }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }

    function update() {
      var overflow = track.scrollWidth > track.clientWidth + 4;
      controls.hidden = !overflow;
      prev.disabled = atStart();
      next.disabled = atEnd();
      return overflow;
    }

    prev.addEventListener('click', function () { track.scrollBy({ left: -pageWidth(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: pageWidth(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () {
        if (!update()) return;
        if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: pageWidth(), behavior: 'smooth' });
      }, 7000);
    }
    function stop() { window.clearInterval(timer); timer = null; }

    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', start);

    update();
    start();
  }
})();
