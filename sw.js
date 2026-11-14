const CACHE_NAME = 'maga-pwa-v2';
const urlsToCache = [
  'dashboard.html',
  'toko.html',
  'branding.html',
  'form.html',
  'absen.html',
  'layout.html',
  'wall.png',
  'maga.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});