const CACHE_NAME = 'maga-swalayan-cache-v1';
const assetsToCache = [
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/app.js',
    './assets/js/router.js',
    './assets/js/views/home.js',
    './assets/js/views/about.js',
    './assets/js/views/contact.js',
    'https://cdn.tailwindcss.com'
];

// Install Service Worker & Cache Aset
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// Activate & Hapus Cache Lama jika ada pembaruan versi
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.claim();
});

// Fetch Strategy: Cache dengan fallback ke Network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});