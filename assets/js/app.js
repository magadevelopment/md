import { initRouter } from './router.js';

// 1. Jalankan Router SPA
initRouter();

// 2. Daftarkan Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker berhasil didaftarkan:', reg.scope))
            .catch(err => console.error('Pendaftaran Service Worker gagal:', err));
    });
}