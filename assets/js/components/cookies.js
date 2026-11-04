/* ==========================================================================
   WHITE SHARK CONSULTING — components/cookies.js
   Banner de cookies conforme al RGPD / LSSI: aceptar, rechazar y configurar.
   - Sin consentimiento no se carga ningún script no necesario.
   - La elección se guarda 12 meses (localStorage) y se puede cambiar desde
     el enlace "Configurar cookies" del footer.
   - Para añadir analítica en el futuro, cargarla dentro de applyConsent()
     solo si consent.analytics === true (ver README).
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'wsc_cookie_consent';
  var VERSION = 1;
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 12 meses

  var banner = document.querySelector('[data-cookie-banner]');
  var dialog = document.querySelector('[data-cookie-dialog]');
  if (!banner || !dialog) return;

  var analyticsInput = dialog.querySelector('[name="cookie-analytics"]');
  var marketingInput = dialog.querySelector('[name="cookie-marketing"]');

  /* ------------------------------------------------------------------------
     1. Lectura y guardado
     ------------------------------------------------------------------------ */
  function read() {
    try {
      var c = JSON.parse(window.localStorage.getItem(KEY));
      if (!c || c.version !== VERSION || Date.now() - c.date > MAX_AGE) return null;
      return c;
    } catch (e) { return null; }
  }

  function save(analytics, marketing) {
    var c = { version: VERSION, date: Date.now(), necessary: true, analytics: !!analytics, marketing: !!marketing };
    try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* almacenamiento no disponible */ }
    applyConsent(c);
    hideBanner();
    if (dialog.open) dialog.close();
  }

  /* ------------------------------------------------------------------------
     2. Aplicar consentimiento
     ------------------------------------------------------------------------ */
  function applyConsent(c) {
    window.wscConsent = c;
    document.dispatchEvent(new CustomEvent('wsc:consent', { detail: c }));
    // Ejemplo para el futuro:
    // if (c.analytics) { cargarAnalitica(); }
  }

  /* ------------------------------------------------------------------------
     3. Banner y panel de configuración
     ------------------------------------------------------------------------ */
  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; }

  function openSettings() {
    var c = read();
    analyticsInput.checked = !!(c && c.analytics);
    marketingInput.checked = !!(c && c.marketing);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cookie-action]');
    if (btn) {
      var action = btn.getAttribute('data-cookie-action');
      if (action === 'accept') save(true, true);
      else if (action === 'reject') save(false, false);
      else if (action === 'settings') openSettings();
      else if (action === 'save') save(analyticsInput.checked, marketingInput.checked);
      else if (action === 'close') dialog.close();
      return;
    }
    if (e.target.closest('[data-cookie-settings]')) {
      e.preventDefault();
      openSettings();
    }
  });

  var current = read();
  if (current) applyConsent(current);
  else showBanner();
})();
