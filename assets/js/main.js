/* ==========================================================================
   WHITE SHARK CONSULTING — main.js
   Configuración global, menú móvil, header al hacer scroll, scroll suave,
   botón de WhatsApp y año del footer.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Configuración (editar aquí)
     ------------------------------------------------------------------------ */
  var CONFIG = {
    // [PENDIENTE] Número de WhatsApp en formato internacional, solo dígitos (ej.: 13055550123).
    // Mientras esté vacío, los botones de WhatsApp llevan a la página de contacto.
    whatsappNumber: '',
    whatsappText: {
      es: 'Hola, me gustaría recibir información sobre los servicios de WHITE SHARK CONSULTING.',
      en: 'Hello, I would like to learn more about WHITE SHARK CONSULTING services.'
    }
  };

  var doc = document.documentElement;
  var lang = (doc.getAttribute('lang') || 'es').slice(0, 2);
  doc.classList.add('js');

  /* ------------------------------------------------------------------------
     2. Header: cambia de estilo al hacer scroll
     ------------------------------------------------------------------------ */
  var header = document.querySelector('[data-header]');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------------
     3. Menú móvil
     ------------------------------------------------------------------------ */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  var desktop = window.matchMedia('(min-width: 1100px)');

  function setMenu(open) {
    if (!toggle || !header) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open
      ? (lang === 'en' ? 'Close menu' : 'Cerrar menú')
      : (lang === 'en' ? 'Open menu' : 'Abrir menú');
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-locked', open);
    if (nav && !desktop.matches) {
      if (open) nav.removeAttribute('inert'); else nav.setAttribute('inert', '');
    }
  }

  function syncNavForViewport() {
    if (!nav) return;
    if (desktop.matches) {
      nav.removeAttribute('inert');
      setMenu(false);
    } else if (!header.classList.contains('is-open')) {
      nav.setAttribute('inert', '');
    }
  }

  if (toggle && nav) {
    syncNavForViewport();
    if (desktop.addEventListener) desktop.addEventListener('change', syncNavForViewport);

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     4. Scroll suave para anclas de la misma página
     (CSS ya aplica scroll-behavior; aquí se gestiona foco y movimiento reducido)
     ------------------------------------------------------------------------ */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="#"]');
    if (!link) return;
    var url = new URL(link.href, window.location.href);
    var samePage = url.pathname.replace(/index\.html$/, '') === window.location.pathname.replace(/index\.html$/, '');
    if (!samePage || !url.hash || url.hash === '#') return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', url.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ------------------------------------------------------------------------
     5. Botones de WhatsApp
     ------------------------------------------------------------------------ */
  if (CONFIG.whatsappNumber) {
    var waUrl = 'https://wa.me/' + CONFIG.whatsappNumber +
      '?text=' + encodeURIComponent(CONFIG.whatsappText[lang] || CONFIG.whatsappText.es);
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = waUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ------------------------------------------------------------------------
     6. Año actual en el footer
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
