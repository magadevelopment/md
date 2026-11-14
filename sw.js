const CACHE_NAME = 'maga-pwa-v11';
const urlsToCache = [
    'maga.png',
    'wall.png',
    'wallpaper.jpeg',
    'manifest.json'
    // PERHATIAN: JANGAN masukkan index.html, layout.html, atau file .html lainnya ke sini!
];

// Saat Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Saat Activate (Hapus cache lama versi sebelumnya)
self.addEventListener('activate', (event) => {
    event.addEventListener('activate', (event) => {
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
});
});

// Strategi Fetch: Network First untuk semua halaman HTML
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Jika request berupa dokumen HTML, wajib ambil dari internet (Network First)
    if (event.request.destination === 'document' || requestUrl.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match('index.html')) // Jika offline total, lempar ke index
        );
        return;
    }

    // Untuk aset gambar/ikon, gunakan cache
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});