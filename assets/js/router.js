import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";
import { renderHome } from './views/home.js';
import { renderLogin, initLoginHandler } from './views/login.js';
import { renderManajemen } from './views/manajemen.js';
import { renderTamu, initTamuHandler } from './views/tamu.js';
import { renderStaf, initStafHandler } from './views/staf.js';
import { renderPengaturan, initPengaturanHandler } from './views/pengaturan.js';
import { renderToko, initTokoHandler } from './views/lokasi.js'; // <-- Diperbarui: Import render & handler toko dari lokasi.js

const routes = {
    '/': renderHome,
    '/toko': renderToko, // <-- Diperbarui: Menampilkan halaman manajemen toko dari lokasi.js
    '/branding': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Manajemen Branding</h2><p class="text-slate-600">Atur materi promosi dan branding.</p></div>`,
    '/event': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Manajemen Event</h2><p class="text-slate-600">Kelola jadwal event toko.</p></div>`,
    '/produk': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Produk</h2><p class="text-slate-600">Kelola data produk.</p></div>`,
    '/banner': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Banner</h2><p class="text-slate-600">Kelola banner utama.</p></div>`,
    '/lokasi': renderToko, // <-- Bisa juga diarahkan ke lokasi.js jika diperlukan
    '/text': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Running Text</h2><p class="text-slate-600">Kelola teks berjalan.</p></div>`,
    '/pendaftaran': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Pendaftaran</h2><p class="text-slate-600">Formulir pendaftaran distributor.</p></div>`,
    '/pengaturan': renderPengaturan,
    '/daftar': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Daftar Pendaftaran</h2><p class="text-slate-600">Formulir pendaftaran distributor dan produk baru.</p></div>`,
    '/absen': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Absensi Karyawan</h2><p class="text-slate-600">Catat kehadiran staf merchandising.</p></div>`,
    '/analytics': () => `<div class="bg-white p-6 border border-slate-200"><h2 class="text-xl font-bold text-indigo-900 mb-2">Analytics</h2><p class="text-slate-600">Analisis data dan statistik Swalayan Maga.</p></div>`,
    '/tamu': renderTamu,
    '/staf': renderStaf,
    '/manajemen': renderManajemen,
    '/login': renderLogin
};

// Fungsi Logout Global
window.handleLogout = () => {
    signOut(auth).then(() => {
        location.hash = '#/login';
    }).catch(error => {
        console.error("Gagal keluar:", error);
    });
};

export async function router() {
    let path = location.hash.slice(1).toLowerCase() || '/';
    const appContainer = document.getElementById('app');

    const sidebar = document.getElementById('sidebar');
    const headerEl = document.querySelector('header');
    const bottomNav = document.getElementById('bottom-nav');

    if (path === '/login') {
        if (sidebar) sidebar.style.display = 'none';
        if (headerEl) headerEl.classList.add('hidden');
        if (bottomNav) bottomNav.classList.add('hidden');
        if (appContainer) {
            appContainer.className = "flex-1 flex flex-col h-screen overflow-hidden p-0 m-0 bg-transparent";
        }
    } else {
        if (sidebar) sidebar.style.display = ''; 
        if (headerEl) headerEl.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden');
        if (appContainer) {
            appContainer.className = "flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 pb-20 md:pb-6";
        }
    }

    // --- RENDER VIEW KE CONTAINER UTAMA LANGSUNG ---
    if (appContainer) {
        const renderFunction = routes[path] || renderHome;
        appContainer.innerHTML = renderFunction();

        if (path === '/login') {
            initLoginHandler();
        } else if (path === '/tamu') {
            initTamuHandler();
        } else if (path === '/staf') {
            initStafHandler();
        } else if (path === '/pengaturan') {
            initPengaturanHandler();
        } else if (path === '/toko' || path === '/lokasi') {
            initTokoHandler(); // <-- Diperbarui: Menjalankan inisialisasi handler toko/lokasi
        }
    }

    // --- UPDATE INDIKATOR WARNA KELAS AKTIF PADA SIDEBAR ---
    const sidebarLinks = document.querySelectorAll('#sidebar-nav a');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + path) {
            link.className = "flex items-center gap-3 px-3 py-2.5 rounded-none text-indigo-700 bg-indigo-50 transition";
        } else {
            link.className = "flex items-center gap-3 px-3 py-2.5 rounded-none text-slate-600 hover:bg-slate-50 transition";
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (!user && path !== '/login') {
            location.hash = '#/login';
            return;
        }

        if (user && path === '/login') {
            location.hash = '#/';
            return;
        }

        let userRole = "User";

        if (user) {
            const email = user.email;
            const photoURL = user.photoURL;

            let displayName = user.displayName || email.split('@')[0];
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.nama) displayName = userData.nama;
                    if (userData.role) userRole = userData.role;
                } else {
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        email: email,
                        nama: displayName,
                        photoURL: photoURL || "",
                        role: "Staf",
                        createdAt: new Date().toISOString()
                    });
                    userRole = "Staf";
                }
            } catch (err) {
                console.error("Gagal memuat data pengguna di Firestore:", err);
            }

            // --- KONTROL VISIBILITAS MENU ADMINISTRATOR (Sidebar) & ROUTE GUARD ---
            const adminMenuSection = document.getElementById('admin-menu-section');
            const adminRoutes = ['/analytics', '/tamu', '/staf', '/manajemen', '/pengaturan'];

            if (userRole === 'Administrator') {
                if (adminMenuSection) adminMenuSection.classList.remove('hidden');
            } else {
                if (adminMenuSection) adminMenuSection.classList.add('hidden');
                
                if (adminRoutes.includes(path)) {
                    location.hash = '#/';
                    return;
                }
            }

            // Update UI Profil Desktop & Mobile
            const userNameEl = document.getElementById('user-name');
            const userEmailEl = document.getElementById('user-email');
            const userRoleEl = document.getElementById('user-role');
            const mobileNameEl = document.getElementById('mobile-dropdown-name');
            const mobileEmailEl = document.getElementById('mobile-dropdown-email');
            const mobileRoleEl = document.getElementById('mobile-user-role');

            if (userNameEl) userNameEl.textContent = displayName;
            if (userEmailEl) userEmailEl.textContent = email;
            if (userRoleEl) userRoleEl.textContent = userRole;
            if (mobileNameEl) mobileNameEl.textContent = displayName;
            if (mobileEmailEl) mobileEmailEl.textContent = email;
            if (mobileRoleEl) mobileRoleEl.textContent = userRole;

            const userInitialEl = document.getElementById('user-initial');
            if (userInitialEl) {
                if (photoURL) {
                    userInitialEl.innerHTML = `<img src="${photoURL}" alt="Profile" class="w-full h-full object-cover rounded-none">`;
                    userInitialEl.className = "w-8 h-8 rounded-none overflow-hidden border border-slate-200 flex-shrink-0";
                } else {
                    const nameParts = displayName.split(' ');
                    const initials = nameParts.length > 1 
                        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
                        : displayName.substring(0, 2).toUpperCase();
                    userInitialEl.textContent = initials;
                    userInitialEl.className = "w-8 h-8 rounded-none bg-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0";
                }
            }

            const mobileAvatarImg = document.getElementById('mobile-user-avatar-img');
            if (mobileAvatarImg && photoURL) {
                mobileAvatarImg.src = photoURL;
            }

            const profileBtn = document.getElementById('mobile-profile-btn');
            const dropdownMenu = document.getElementById('mobile-dropdown-menu');

            if (profileBtn && dropdownMenu) {
                profileBtn.onclick = (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('hidden');
                };
                dropdownMenu.onclick = (e) => {
                    e.stopPropagation();
                };
            }
        }

        // --- RENDER BOTTOM NAVIGATION BERDASARKAN ROLE ---
        if (bottomNav && path !== '/login') {
            if (userRole === 'Administrator') {
                bottomNav.innerHTML = `
                    <a href="#/" data-link class="flex flex-col items-center justify-center ${path === '/' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-[10px] font-medium">Beranda</span>
                    </a>
                    <a href="#/toko" data-link class="flex flex-col items-center justify-center ${path === '/toko' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        <span class="text-[10px] font-medium">Toko</span>
                    </a>
                    <a href="#/branding" data-link class="flex flex-col items-center justify-center ${path === '/branding' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                        <span class="text-[10px] font-medium">Branding</span>
                    </a>
                    <div class="relative flex-1">
                        <button id="mobile-more-btn" class="w-full flex flex-col items-center justify-center ${['/analytics', '/tamu', '/staf', '/manajemen', '/pengaturan'].includes(path) ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} py-1 focus:outline-none">
                            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                            <span class="text-[10px] font-medium">More</span>
                        </button>
                        <div id="mobile-more-popup" class="hidden absolute bottom-16 right-0 w-48 bg-white border border-slate-200 rounded-none shadow-xl py-2 z-50">
                            <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administrator</div>
                            <a href="#/analytics" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Analytics</a>
                            <a href="#/tamu" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Tamu</a>
                            <a href="#/staf" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Staf</a>
                            <a href="#/manajemen" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Manajemen</a>
                            <a href="#/pengaturan" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Pengaturan</a>
                            <div class="border-t border-slate-100 my-1"></div>
                            <button onclick="handleLogout()" class="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                Keluar
                            </button>
                        </div>
                    </div>
                `;
            } else {
                bottomNav.innerHTML = `
                    <a href="#/" data-link class="flex flex-col items-center justify-center ${path === '/' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-[10px] font-medium">Beranda</span>
                    </a>
                    <a href="#/toko" data-link class="flex flex-col items-center justify-center ${path === '/toko' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        <span class="text-[10px] font-medium">Toko</span>
                    </a>
                    <a href="#/branding" data-link class="flex flex-col items-center justify-center ${path === '/branding' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                        <span class="text-[10px] font-medium">Branding</span>
                    </a>
                    <a href="#/daftar" data-link class="flex flex-col items-center justify-center ${path === '/daftar' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} flex-1 py-1">
                        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                        <span class="text-[10px] font-medium">Daftar</span>
                    </a>
                    <div class="relative flex-1">
                        <button id="mobile-more-btn" class="w-full flex flex-col items-center justify-center ${['/absen'].includes(path) ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'} py-1 focus:outline-none">
                            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                            <span class="text-[10px] font-medium">More</span>
                        </button>
                        <div id="mobile-more-popup" class="hidden absolute bottom-16 right-0 w-48 bg-white border border-slate-200 rounded-none shadow-xl py-2 z-50">
                            <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menu Lainnya</div>
                            <a href="#/absen" data-link class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Absen Karyawan</a>
                            <div class="border-t border-slate-100 my-1"></div>
                            <button onclick="handleLogout()" class="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                Keluar
                            </button>
                        </div>
                    </div>
                `;
            }

            const moreBtn = document.getElementById('mobile-more-btn');
            const morePopup = document.getElementById('mobile-more-popup');

            if (moreBtn && morePopup) {
                moreBtn.onclick = (e) => {
                    e.stopPropagation();
                    morePopup.classList.toggle('hidden');
                };
                morePopup.onclick = (e) => {
                    e.stopPropagation();
                };
            }
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
                location.hash = e.target.getAttribute('href');
                const popup = document.getElementById('mobile-more-popup');
                if (popup) popup.classList.add('hidden');
            }
        });

        window.addEventListener('click', (e) => {
            const dropdownMenu = document.getElementById('mobile-dropdown-menu');
            const profileBtn = document.getElementById('mobile-profile-btn');
            const morePopup = document.getElementById('mobile-more-popup');
            const moreBtn = document.getElementById('mobile-more-btn');
            
            if (dropdownMenu && profileBtn) {
                if (!dropdownMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            }
            if (morePopup && moreBtn) {
                if (!morePopup.contains(e.target) && !moreBtn.contains(e.target)) {
                    morePopup.classList.add('hidden');
                }
            }
        });
    });
}