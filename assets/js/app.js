(() => {
  const toggle = document.querySelector('.navbar-toggler');
  const menu = document.querySelector('#ums-main-nav');

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // The landing page remains fully usable when service workers are unavailable.
      });
    });
  }

  const contactForm = document.querySelector('.contact-form');
  let smartFormsRequested = false;

  const loadSmartForms = () => {
    if (smartFormsRequested) {
      return;
    }

    smartFormsRequested = true;
    const script = document.createElement('script');
    script.src = 'assets/js/smart-forms.min.js';
    script.async = true;
    document.head.appendChild(script);
  };

  if (contactForm) {
    contactForm.addEventListener('focusin', loadSmartForms, { once: true });
    contactForm.addEventListener('pointerenter', loadSmartForms, { once: true });

    if ('IntersectionObserver' in window) {
      const formObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadSmartForms();
          observer.disconnect();
        }
      }, { rootMargin: '600px 0px' });

      formObserver.observe(contactForm);
    }
  }

  const loadAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-8MS9P50S36');

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8MS9P50S36';
    document.head.appendChild(script);
  };

  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadAnalytics, { timeout: 3000 });
    } else {
      window.setTimeout(loadAnalytics, 2000);
    }
  });
})();
