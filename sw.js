const CACHE_NAME = 'ums-landing-v10-app-style';
const APP_SHELL = [
  '/',
  '/index.html',
  '/ucd/',
  '/ucd/index.html',
  '/privacy-policy/',
  '/terms/',
  '/offline.html',
  '/manifest.json',
  '/assets/bootstrap/css/bootstrap.min.css',
  '/assets/bootstrap/js/bootstrap.min.js',
  '/assets/fonts/fontawesome-all.min.css',
  '/assets/css/launch.css?v=20260810-appstyle',
  '/assets/js/landing.js?v=20260810-appstyle',
  '/assets/img/UMS%20Logo.svg',
  '/assets/img/UMS-Dashboard.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request, { ignoreSearch: true }).then((cached) => cached || caches.match('/offline.html'))));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
