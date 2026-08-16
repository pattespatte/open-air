/* ===========================================================================
   sw.js — Service Worker for Open Air
   Precaches the entire app so it works fully offline (elevator, plane, subway).
   Critical: emergency tools must load with no signal.
   =========================================================================== */

const CACHE_NAME = 'openair-v7';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/style.css',
  './js/app.js',
  './js/store.js',
  './js/i18n.js',
  './js/countries.js',
  './js/overlay.js',
  './js/views/now.js',
  './js/views/practice.js',
  './js/views/log.js',
  './js/views/path.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Strategy: cache-first for app shell (instant, offline),
   network fallback for anything else.
   For navigations, fall back to the cached index.html if offline so the
   app shell always loads even if the specific URL isn't precached. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate';

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache same-origin responses for resilience
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline and not in cache: for navigations, serve the app shell
        if (isNavigation) return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
