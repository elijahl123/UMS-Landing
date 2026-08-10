(() => {
  'use strict';

  const isUcdPage = document.body.dataset.page === 'ucd';
  const attributionKeys = ['campaign', 'ambassador', 'society', 'referral'];
  const allowedValue = /[^a-zA-Z0-9._-]/g;
  const API_ORIGIN = 'https://app.untitledmanagementsoftware.com';

  function readAttribution() {
    const params = new URLSearchParams(window.location.search);
    const attribution = {};
    attributionKeys.forEach((key) => {
      const raw = params.get(key);
      if (!raw) return;
      const value = raw.replace(allowedValue, '').slice(0, 64);
      if (value) attribution[key] = value;
    });
    return attribution;
  }

  const attribution = readAttribution();

  function signupUrl() {
    const params = new URLSearchParams({ source: 'ucd_landing', ...attribution });
    return `${API_ORIGIN}/#/signup?${params.toString()}`;
  }

  async function postJson(path, payload) {
    const response = await fetch(`${API_ORIGIN}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      keepalive: true,
    });
    if (!response.ok && response.status !== 409) throw new Error(`Request failed: ${response.status}`);
    return response;
  }

  function track(event) {
    return postJson('/api/launch/events', {
      event,
      occurredAt: new Date().toISOString(),
      page: 'ucd',
      ...attribution,
    }).catch(() => undefined);
  }

  if (isUcdPage) {
    document.querySelectorAll('.js-signup-cta').forEach((link) => {
      link.href = signupUrl();
      link.addEventListener('click', () => track('landing_cta_clicked'));
    });

    const explainer = document.querySelector('[data-track-view="ai_free_explainer_viewed"]');
    if (explainer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        track('ai_free_explainer_viewed');
      }, { threshold: 0.45 });
      observer.observe(explainer);
    }

    document.querySelectorAll('.launch-waitlist').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.elements.email.value.trim();
        const consent = form.elements.consent.checked;
        const status = form.querySelector('.form-status');
        const button = form.querySelector('button[type="submit"]');

        status.className = 'form-status';
        if (!form.elements.email.checkValidity()) {
          status.textContent = 'Enter a valid email address.';
          status.classList.add('error');
          form.elements.email.focus();
          return;
        }
        if (!consent) {
          status.textContent = 'Please confirm that you want to join this list.';
          status.classList.add('error');
          form.elements.consent.focus();
          return;
        }

        button.disabled = true;
        status.textContent = 'Joining…';
        try {
          const response = await postJson('/api/launch/waitlist', {
            email,
            list: form.dataset.list,
            consent: true,
            source: 'ucd_landing',
            ...attribution,
          });
          status.textContent = response.status === 409 ? 'You’re already on this list.' : 'You’re on the list. Check your inbox for updates.';
          status.classList.add('success');
          if (form.dataset.list === 'ios' && response.status !== 409) track('ios_waitlist_signup');
          form.reset();
        } catch (_error) {
          status.textContent = 'We did not save your email. Please try again.';
          status.classList.add('error');
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  const contactForm = document.querySelector('.contact-form[data-bss-recipient]');
  if (contactForm) {
    let requested = false;
    const loadFormHandler = () => {
      if (requested) return;
      requested = true;
      const script = document.createElement('script');
      script.src = 'assets/js/smart-forms.min.js';
      script.async = true;
      document.head.appendChild(script);
    };
    contactForm.addEventListener('focusin', loadFormHandler, { once: true });
    contactForm.addEventListener('pointerenter', loadFormHandler, { once: true });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
  }
})();
