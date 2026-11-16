import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "../firebase-init.js";

export function renderHome() {
    return `
        <div class="space-y-6 pb-10 relative">
            
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

            <!-- Event & Kegiatan di Bawah Banner -->
            <div class="bg-white p-5 rounded-none border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">EVENT & KEGIATAN</h3>
                </div>

                <!-- Kontainer Daftar Event -->
                <div id="home-event-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div class="col-span-full p-6 text-center text-slate-400 text-xs">
                        Memuat data event...
                    </div>
                </div>
            </div>

            <!-- Produk di Bawah Event -->
            <div class="bg-white p-5 rounded-none border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">PRODUK</h3>
                </div>

                <!-- Kontainer Daftar Produk -->
                <div id="home-produk-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div class="col-span-full p-6 text-center text-slate-400 text-xs">
                        Memuat data produk...
                    </div>
                </div>
            </div>

            <!-- MODAL ZOOM GAMBAR (LIGHTBOX) -->
            <div id="image-modal" class="hidden fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
                <div class="relative max-w-lg w-full bg-white p-2 rounded-none shadow-2xl flex flex-col items-center">
                    <button id="close-image-modal" class="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition cursor-pointer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <img id="modal-zoomed-img" src="" alt="Zoom Image" class="max-h-[80vh] w-auto object-contain">
                    <p id="modal-zoomed-title" class="text-xs font-bold text-slate-800 mt-2 text-center"></p>
                </div>
            </div>

        </div>
    `;
}

export async function initHomeHandler() {
    const container = document.getElementById('home-banner-container');
    const eventContainer = document.getElementById('home-event-container');
    const produkContainer = document.getElementById('home-produk-container');
    const welcomeTitle = document.getElementById('welcome-user-title');
    const btnPrev = document.getElementById('banner-prev');
    const btnNext = document.getElementById('banner-next');
    
    // Modal Zoom Elemen
    const imageModal = document.getElementById('image-modal');
    const zoomedImg = document.getElementById('modal-zoomed-img');
    const zoomedTitle = document.getElementById('modal-zoomed-title');
    const closeImageModal = document.getElementById('close-image-modal');

    if (closeImageModal && imageModal) {
        closeImageModal.onclick = () => imageModal.classList.add('hidden');
        imageModal.onclick = (e) => {
            if (e.target === imageModal) imageModal.classList.add('hidden');
        };
    }

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

    // --- 1. LOAD BANNER UTAMA ---
    if (container) {
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
            } else {
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
            }
        } catch (err) {
            console.error("Gagal memuat banner beranda:", err);
            container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500">Gagal memuat banner dari database.</div>`;
        }
    }

    // --- 2. LOAD EVENT & KEGIATAN DI BAWAH BANNER ---
    if (eventContainer) {
        try {
            const eventSnapshot = await getDocs(collection(db, "event"));
            let eventList = [];
            eventSnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.status !== false) {
                    eventList.push({ id: docSnap.id, ...data });
                }
            });

            if (eventList.length === 0) {
                eventContainer.innerHTML = `<div class="col-span-full p-6 text-center text-slate-400 text-xs">Belum ada event atau kegiatan aktif.</div>`;
            } else {
                let eventHtml = "";
                eventList.forEach((item) => {
                    const img = item.gambar || "";
                    const title = item.judul || "Event Toko";
                    const desc = item.deskripsi || "-";
                    
                    let tanggalStr = '-';
                    if (item.tipeTanggal === 'period') {
                        tanggalStr = `${item.tanggalMulai || ''} s/d ${item.tanggalSelesai || ''}`;
                    } else {
                        tanggalStr = item.tanggalSingle || item.createdAt?.substring(0, 10) || '-';
                    }

                    eventHtml += `
                        <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                            <div class="w-full h-80 bg-slate-900 border-b border-slate-100 overflow-hidden flex items-center justify-center cursor-pointer zoom-thumb" data-img="${img}" data-title="${title}">
                                ${img ? `<img src="${img}" alt="${title}" class="w-full h-full object-contain pointer-events-none hover:scale-105 transition duration-300">` : `<span class="text-xs text-slate-400">No Image</span>`}
                            </div>
                            <div class="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                                <div>
                                    <span class="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-none mb-1">${tanggalStr}</span>
                                    <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${title}</h4>
                                    <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${desc}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                eventContainer.innerHTML = eventHtml;
            }
        } catch (err) {
            console.error("Gagal memuat data event di beranda:", err);
            eventContainer.innerHTML = `<div class="col-span-full p-6 text-center text-red-500 text-xs">Gagal memuat event dari database.</div>`;
        }
    }

    // --- 3. LOAD PRODUK DI BAWAH EVENT ---
    if (produkContainer) {
        try {
            const produkSnapshot = await getDocs(collection(db, "produk"));
            let produkList = [];
            produkSnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.status !== false) {
                    produkList.push({ id: docSnap.id, ...data });
                }
            });

            if (produkList.length === 0) {
                produkContainer.innerHTML = `<div class="col-span-full p-6 text-center text-slate-400 text-xs">Belum ada produk aktif.</div>`;
            } else {
                let produkHtml = "";
                produkList.forEach((item) => {
                    const img = item.gambar || "";
                    const title = item.nama || "Produk Toko";
                    const hargaAwal = parseFloat(item.hargaAwal) || 0;
                    const diskon = parseFloat(item.diskonPersen) || 0;
                    const hargaAkhir = parseFloat(item.hargaAkhir) || hargaAwal;

                    const hargaAwalStr = "Rp " + hargaAwal.toLocaleString('id-ID');
                    const hargaAkhirStr = "Rp " + hargaAkhir.toLocaleString('id-ID');

                    produkHtml += `
                        <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                            <div class="w-full h-80 bg-slate-900 border-b border-slate-100 overflow-hidden flex items-center justify-center cursor-pointer zoom-thumb" data-img="${img}" data-title="${title}">
                                ${img ? `<img src="${img}" alt="${title}" class="w-full h-full object-contain pointer-events-none hover:scale-105 transition duration-300">` : `<span class="text-xs text-slate-400">No Image</span>`}
                            </div>
                            <div class="p-3.5 flex flex-col justify-between flex-1 space-y-1.5">
                                <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${title}</h4>
                                <div class="space-y-0.5">
                                    ${diskon > 0 ? `<p class="text-[11px] text-slate-400 line-through">${hargaAwalStr}</p>` : ''}
                                    <div class="flex items-center justify-between">
                                        <p class="text-xs font-bold text-indigo-900">${hargaAkhirStr}</p>
                                        ${diskon > 0 ? `<span class="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 font-semibold">Diskon ${diskon}%</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                produkContainer.innerHTML = produkHtml;
            }
        } catch (err) {
            console.error("Gagal memuat data produk di beranda:", err);
            produkContainer.innerHTML = `<div class="col-span-full p-6 text-center text-red-500 text-xs">Gagal memuat produk dari database.</div>`;
        }
    }

    // --- GLOBAL ZOOM HANDLER (Event Delegation untuk Event & Produk) ---
    const handleZoomClick = (e) => {
        const thumb = e.target.closest('.zoom-thumb');
        if (thumb) {
            const imgSrc = thumb.getAttribute('data-img');
            const imgTitle = thumb.getAttribute('data-title');
            if (imgSrc && imageModal && zoomedImg && zoomedTitle) {
                zoomedImg.src = imgSrc;
                zoomedTitle.textContent = imgTitle;
                imageModal.classList.remove('hidden');
            }
        }
    };

    if (eventContainer) eventContainer.onclick = handleZoomClick;
    if (produkContainer) produkContainer.onclick = handleZoomClick;
}