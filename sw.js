const CACHE_NAME = 'ums-landing-v8';
const APP_SHELL = [
  './',
  './index.html',
  './privacy-policy/',
  './terms/',
  './offline.html',
  './manifest.json',
  './assets/bootstrap/css/bootstrap.min.css',
  './assets/css/styles.min.css',
  './assets/js/app.js',
  './assets/js/smart-forms.min.js',
  './assets/img/UMS%20Logo.svg',
  './assets/img/fontawesome-pro.svg',
  './assets/img/pwa-icon-192.png',
  './assets/img/pwa-icon-512.png',
  './assets/img/pwa-icon-maskable-512.png',
  './assets/img/ums-app-dashboard-desktop.svg',
  './assets/img/ums-app-dashboard-mobile.svg',
  './assets/img/ums-abstract-dashboard.svg',
  './assets/img/ums-abstract-calendar.svg',
  './assets/img/ums-abstract-schedule.svg',
  './assets/img/ums-abstract-homework.svg',
  './assets/img/ums-abstract-notes.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.hostname.includes('google-analytics.com') || url.hostname.includes('googletagmanager.com')) {
    return;
  }

  if (request.mode === 'navigate') {
    const pageRequest = new Request(`${url.origin}${url.pathname}`);
    const update = fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(pageRequest, copy));
        }
        return response;
      });

    event.waitUntil(update.catch(() => undefined));
    event.respondWith(
      caches.match(pageRequest, { ignoreSearch: true })
        .then((cached) => {
          if (cached) {
            return cached;
          }

          return update.catch(() => caches.match('./offline.html'));
        })
    );
    return;
  }

  const update = fetch(request)
    .then((response) => {
      if (response.ok || response.type === 'opaque') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    });

  event.waitUntil(update.catch(() => undefined));
  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then((cached) => {
        if (cached) {
          return cached;
        }

        return update.catch(() => Response.error());
      })
  );
});
