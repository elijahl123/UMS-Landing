(() => {
  'use strict';

  const page = document.body.dataset.page;
  const source = document.body.dataset.source;
  const incomingList = document.body.dataset.incomingList;
  const isCampusPage = ['ucd', 'palomar'].includes(page) && ['ucd_landing', 'palomar_landing'].includes(source);
  const attributionKeys = ['campaign', 'ambassador', 'society', 'referral'];
  const allowedValue = /^[A-Za-z0-9._-]{1,64}$/;
  const API_ORIGIN = 'https://app.untitledmanagementsoftware.com';
  const launchSessionKey = `ums_${page || 'site'}_launch_session`;

  function randomSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID().replaceAll('-', '');
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
  }

  function launchSession() {
    const current = sessionStorage.getItem(launchSessionKey);
    if (current && allowedValue.test(current)) return current;
    const created = randomSessionId();
    sessionStorage.setItem(launchSessionKey, created);
    return created;
  }

  function readAttribution() {
    const params = new URLSearchParams(window.location.search);
    const attribution = {};
    attributionKeys.forEach((key) => {
      const value = params.get(key)?.trim();
      if (value && allowedValue.test(value)) attribution[key] = value;
    });
    return attribution;
  }

  const attribution = readAttribution();
  const sessionId = isCampusPage ? launchSession() : null;

  function signupUrl() {
    const params = new URLSearchParams({ source, ...attribution, launch_session: sessionId });
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
      page,
      source,
      launchSession: sessionId,
      ...attribution,
    }).catch(() => undefined);
  }

  if (isCampusPage) {
    const waitlistResult = new URLSearchParams(window.location.search).get('waitlist');
    const waitlistNotice = document.querySelector('[data-waitlist-result]');
    if (waitlistNotice && waitlistResult) {
      const messages = {
        confirmed: 'Your email is confirmed. You are on the selected list.',
        unsubscribed: 'You have been unsubscribed from that list.',
        invalid: 'That link is invalid or has expired. Submit the form again for a new confirmation email.',
      };
      if (messages[waitlistResult]) {
        waitlistNotice.textContent = messages[waitlistResult];
        waitlistNotice.classList.add(waitlistResult === 'invalid' ? 'error' : 'success');
        waitlistNotice.hidden = false;
        waitlistNotice.focus();
      }
    }

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
        const marketingConsent = form.elements.marketingConsent.checked;
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
          const list = form.dataset.list === 'incoming' ? incomingList : form.dataset.list;
          await postJson('/api/launch/waitlist', {
            email,
            list,
            consent: true,
            marketingConsent,
            source,
            launchSession: sessionId,
            ...attribution,
          });
          status.textContent = 'Check your inbox to confirm your place.';
          status.classList.add('success');
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

  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
})();
