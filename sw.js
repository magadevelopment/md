const CACHE_NAME = 'maga-pwa-v9';
const urlsToCache = [
  'index.html',
  'dashboard.html',
  'toko.html',
  'branding.html',
  'form.html',
  'absen.html',
  'layout.html',
  'wall.png',
  'maga.png',
  // CDN eksternal yang aman untuk di-cache
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.skipWaiting(); // Memaksa Service Worker langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan cara aman agar jika ada satu CDN yang gagal, 
      // tidak menggagalkan total instalasi cache utama
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url).catch(err => console.warn('Gagal cache:', url, err)))
      );
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
        // Fallback jika offline dan aset tidak ada di cache
      });
    })
  );
});