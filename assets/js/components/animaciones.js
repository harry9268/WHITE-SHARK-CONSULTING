/* ==========================================================================
   WHITE SHARK CONSULTING — components/animaciones.js
   Aparición suave de elementos [data-animate] al entrar en pantalla y
   contador animado para [data-count].
   El contenido es visible sin JS: solo se ocultan los elementos que están
   por debajo de la ventana en el momento de cargar.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  /* ------------------------------------------------------------------------
     1. Aparición al hacer scroll
     ------------------------------------------------------------------------ */
  var items = document.querySelectorAll('[data-animate]');
  var viewportH = window.innerHeight;

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  items.forEach(function (el) {
    if (el.getBoundingClientRect().top > viewportH * 0.9) {
      el.classList.add('anim-ready');
      revealObserver.observe(el);
    }
  });

  /* ------------------------------------------------------------------------
     2. Contador (ej.: <span data-count="30">30</span>)
     ------------------------------------------------------------------------ */
  var counters = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(end)) return;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(end * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { countObserver.observe(el); });
})();
