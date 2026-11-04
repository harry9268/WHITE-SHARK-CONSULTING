/* ==========================================================================
   WHITE SHARK CONSULTING — components/formulario.js
   Validación en cliente y envío por fetch a php/enviar.php sin recargar.
   La validación se repite en el servidor (enviar.php).
   ========================================================================== */
(function () {
  'use strict';

  var forms = document.querySelectorAll('[data-contact-form]');
  if (!forms.length) return;

  var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);

  /* ------------------------------------------------------------------------
     1. Textos por idioma
     ------------------------------------------------------------------------ */
  var MSG = {
    es: {
      required: 'Este campo es obligatorio.',
      email: 'Introduce un email válido.',
      phone: 'Introduce un teléfono válido.',
      min: 'El mensaje debe tener al menos 10 caracteres.',
      privacy: 'Debes aceptar la política de privacidad.',
      sending: 'Enviando…',
      success: 'Gracias por tu mensaje. Te responderemos lo antes posible.',
      error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos por email.',
      invalid: 'Revisa los campos marcados.'
    },
    en: {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number.',
      min: 'Your message should be at least 10 characters long.',
      privacy: 'Please accept the privacy policy.',
      sending: 'Sending…',
      success: 'Thank you for reaching out. We will get back to you shortly.',
      error: 'Your message could not be sent. Please try again or email us directly.',
      invalid: 'Please review the highlighted fields.'
    }
  };
  var t = MSG[lang] || MSG.es;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+()\d\s.-]{6,25}$/;

  /* ------------------------------------------------------------------------
     2. Validación de campos
     ------------------------------------------------------------------------ */
  function fieldWrap(input) { return input.closest('.field, .checkbox'); }

  function setError(input, message) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    var errId = input.id + '-error';
    var err = document.getElementById(errId);
    if (message) {
      wrap.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (!err) {
        err = document.createElement('p');
        err.className = 'field__error';
        err.id = errId;
        wrap.appendChild(err);
      }
      err.textContent = message;
      var described = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (described.indexOf(errId) === -1) described.push(errId);
      input.setAttribute('aria-describedby', described.join(' '));
    } else {
      wrap.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      if (err) err.remove();
      var rest = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (id) { return id && id !== errId; });
      if (rest.length) input.setAttribute('aria-describedby', rest.join(' '));
      else input.removeAttribute('aria-describedby');
    }
  }

  function validate(input) {
    var v = input.type === 'checkbox' ? input.checked : input.value.trim();
    var msg = '';
    if (input.required && !v) msg = input.type === 'checkbox' ? t.privacy : t.required;
    else if (v && input.type === 'email' && !EMAIL_RE.test(v)) msg = t.email;
    else if (v && input.type === 'tel' && !PHONE_RE.test(v)) msg = t.phone;
    else if (v && input.name === 'mensaje' && v.length < 10) msg = t.min;
    setError(input, msg);
    return !msg;
  }

  /* ------------------------------------------------------------------------
     3. Envío
     ------------------------------------------------------------------------ */
  forms.forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('[type="submit"]');
    var buttonLabel = button ? button.innerHTML : '';
    var fields = form.querySelectorAll('input:not([type="hidden"]):not([tabindex="-1"]), select, textarea');
    var ts = form.querySelector('[name="_ts"]');
    if (ts) ts.value = String(Math.floor(Date.now() / 1000));

    form.setAttribute('novalidate', '');

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value || input.type === 'checkbox') validate(input); });
      input.addEventListener('input', function () { if (fieldWrap(input) && fieldWrap(input).classList.contains('is-invalid')) validate(input); });
      input.addEventListener('change', function () { if (input.type === 'checkbox') validate(input); });
    });

    function showStatus(type, text) {
      status.className = 'form__status is-' + type;
      status.textContent = text;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        showStatus('error', t.invalid);
        firstInvalid.focus();
        return;
      }

      button.classList.add('is-loading');
      button.disabled = true;
      button.textContent = t.sending;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'fetch' }
      })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false }; });
        })
        .then(function (res) {
          if (res && res.ok) {
            showStatus('success', res.message || t.success);
            form.reset();
            if (ts) ts.value = String(Math.floor(Date.now() / 1000));
          } else {
            showStatus('error', (res && res.message) || t.error);
          }
        })
        .catch(function () { showStatus('error', t.error); })
        .then(function () {
          button.classList.remove('is-loading');
          button.disabled = false;
          button.innerHTML = buttonLabel;
          status.focus();
        });
    });
  });
})();
