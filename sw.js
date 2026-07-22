// Cache version — bump this any time you want to force all clients to
// discard old cached files and fetch fresh ones.
const CACHE_NAME = 'gdbm-school-v2';
const APP_SHELL = ['./manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for EVERYTHING (index.html, app.js, style.css, icons).
// This guarantees you always get the latest deployed files whenever you
// have a connection. The cache is only used as a fallback when the
// network request fails (i.e. genuinely offline), so the app can still
// open — just showing the last successfully-loaded version.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
