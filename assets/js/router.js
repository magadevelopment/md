import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-init.js";
import { renderHome } from './views/home.js';
import { renderAbout } from './views/about.js';
import { renderContact } from './views/contact.js';
import { renderLogin, initLoginHandler } from './views/login.js';

const routes = {
    '/': renderHome,
    '/about': renderAbout,
    '/contact': renderContact,
    '/login': renderLogin
};

export async function router() {
    let path = location.hash.slice(1).toLowerCase() || '/';
    const appContainer = document.getElementById('app');

    // Cek status autentikasi Firebase
    onAuthStateChanged(auth, (user) => {
        const navContainer = document.querySelector('nav');

        if (!user && path !== '/login') {
            // Belum login dan mencoba akses halaman lain -> lempar ke /login
            location.hash = '#/login';
            return;
        }

        if (user && path === '/login') {
            // Sudah login tapi buka halaman login -> lempar ke beranda
            location.hash = '#/';
            return;
        }

        // Tampilkan/Sembunyikan tombol navigasi atau tambahkan tombol Logout jika sudah login
        if (user) {
            navContainer.innerHTML = `
                <a href="#/" data-link class="hover:text-blue-200 transition">Beranda</a>
                <a href="#/about" data-link class="hover:text-blue-200 transition">Tentang</a>
                <a href="#/contact" data-link class="hover:text-blue-200 transition">Kontak</a>
                <button id="btn-logout" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition">Keluar</button>
            `;
            
            // Event listener tombol logout
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                btnLogout.onclick = () => signOut(auth).then(() => location.hash = '#/login');
            }
        } else {
            navContainer.innerHTML = '';
        }

        // Render view yang sesuai
        const renderFunction = routes[path] || renderHome;
        appContainer.innerHTML = renderFunction();

        // Jalankan script khusus jika berada di halaman login
        if (path === '/login') {
            initLoginHandler();
        }
    });
}

export function initRouter() {
    window.addEventListener('hashchange', router);
    window.addEventListener('DOMContentLoaded', () => {
        router();
        
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                location.hash = href;
            }
        });
    });
}