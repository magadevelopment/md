const CACHE_NAME = 'maga-pwa-v4';
const urlsToCache = [
  'dashboard.html',
  'toko.html',
  'branding.html',
  'form.html',
  'absen.html',
  'layout.html',
  'wall.png',
  'maga.png',
  // Tambahkan CDN eksternal agar terbaca saat PWA offline/terinstal
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
];

self.addEventListener('install', (event) => {
  event.skipWaiting(); // Memaksa Service Worker langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Menghapus cache versi lama yang menumpuk
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback opsional jika fetch gagal total
      });
    })
  );
});