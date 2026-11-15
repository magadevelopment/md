import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "../firebase-init.js";

export function renderHome() {
    return `
        <div class="space-y-6">
            
            <!-- Banner Utama Selamat Datang -->
            <div class="bg-indigo-900 text-white p-6 rounded-none shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="space-y-1 z-10">
                    <span class="inline-block bg-indigo-700 text-indigo-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-none tracking-wide uppercase">SISTEM AKTIF</span>
                    <h1 class="text-2xl font-bold tracking-tight" id="welcome-user-title">Selamat Datang! 👋</h1>
                </div>
                <div class="bg-indigo-800/80 border border-indigo-700 text-indigo-100 text-xs px-3 py-1.5 rounded-none flex items-center gap-2 z-10">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Sistem Merchandising Aktif
                </div>
            </div>

            <!-- Banner & Informasi Utama -->
            <div class="bg-white p-5 rounded-none border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">BANNER & INFORMASI UTAMA</h3>
                    <div class="flex gap-1">
                        <button id="banner-prev" class="p-1.5 border border-slate-200 rounded-none hover:bg-slate-50 text-slate-600 cursor-pointer"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <button id="banner-next" class="p-1.5 border border-slate-200 rounded-none hover:bg-slate-50 text-slate-600 cursor-pointer"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                    </div>
                </div>

                <!-- Slider / Card Gambar Dinamis (1 di HP, 4 di Desktop) -->
                <div id="home-banner-container" class="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-hidden">
                    <div class="col-span-full p-8 text-center text-slate-400">
                        Memuat banner utama...
                    </div>
                </div>
            </div>

        </div>
    `;
}

export async function initHomeHandler() {
    const container = document.getElementById('home-banner-container');
    const welcomeTitle = document.getElementById('welcome-user-title');
    const btnPrev = document.getElementById('banner-prev');
    const btnNext = document.getElementById('banner-next');

    // Memuat nama user yang sedang login untuk ditampilkan di Banner Utama
    try {
        const currentUser = auth.currentUser;
        if (currentUser && welcomeTitle) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            let displayName = currentUser.displayName || currentUser.email.split('@')[0];
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

            if (userDocSnap.exists() && userDocSnap.data().nama) {
                displayName = userDocSnap.data().nama;
            }

            welcomeTitle.textContent = `Selamat Datang, ${displayName}! 👋`;
        }
    } catch (err) {
        console.error("Gagal memuat nama user untuk beranda:", err);
    }

    if (!container) return;

    let autoPlayInterval = null;

    try {
        const querySnapshot = await getDocs(collection(db, "banner"));
        let bannerList = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status !== false) {
                bannerList.push({ id: docSnap.id, ...data });
            }
        });

        if (bannerList.length === 0) {
            container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400">Belum ada data banner aktif.</div>`;
            return;
        }

        let currentIndex = 0;

        const renderBanners = () => {
            let html = "";
            const isMobile = window.innerWidth < 768;
            const displayCount = isMobile ? 1 : 4;

            for (let i = 0; i < displayCount; i++) {
                const index = (currentIndex + i) % bannerList.length;
                const item = bannerList[index];
                const img = item.gambar || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80";
                const title = item.nama || "Banner Utama";

                html += `
                    <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                        <img src="${img}" alt="${title}" class="w-full h-36 object-cover">
                        <div class="p-3">
                            <p class="text-sm font-medium text-slate-700 truncate">${title}</p>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % bannerList.length;
                renderBanners();
            }, 3000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };

        renderBanners();
        startAutoPlay();

        container.onmouseenter = stopAutoPlay;
        container.onmouseleave = startAutoPlay;

        if (btnNext) {
            btnNext.onclick = () => {
                currentIndex = (currentIndex + 1) % bannerList.length;
                renderBanners();
                startAutoPlay();
            };
        }

        if (btnPrev) {
            btnPrev.onclick = () => {
                currentIndex = (currentIndex - 1 + bannerList.length) % bannerList.length;
                renderBanners();
                startAutoPlay();
            };
        }

        window.addEventListener('resize', renderBanners);

    } catch (err) {
        console.error("Gagal memuat banner beranda:", err);
        container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500">Gagal memuat banner dari database.</div>`;
    }
}