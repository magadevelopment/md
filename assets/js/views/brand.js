import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderBrandPublic() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto relative pb-12">
            <!-- Header Title -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800">
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Daftar Titik & Aset Branding</h1>
                        <span id="badge-total-public" class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-900">Total: 0 Aset</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Informasi ketersediaan titik promosi, harga sewa bulanan dan tahunan, serta status pemesanan di Swalayan Maga.</p>
                </div>
            </div>

            <!-- Filter & Search Bar (Smooth Grid Layout) -->
            <div class="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <select id="filter-public-lokasi" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        <option value="">-- Semua Lokasi --</option>
                    </select>
                </div>
                <div>
                    <select id="filter-public-kategori" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        <option value="">-- Semua Kategori --</option>
                        <option value="Billboard">Billboard</option>
                        <option value="Neon Box">Neon Box</option>
                        <option value="Stand / Booth">Stand / Booth</option>
                        <option value="Display Produk">Display Produk</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div>
                    <select id="filter-public-status" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        <option value="">-- Semua Status --</option>
                        <option value="Belum Dipesan">Belum Dipesan</option>
                        <option value="Sudah Dipesan">Sudah Dipesan</option>
                    </select>
                </div>
                <div class="relative">
                    <input type="text" id="search-public-branding" placeholder="Cari nama aset atau kode..." class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 pr-8 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500">
                    <svg class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>

            <!-- Grid Card Branding Public (Read-Only) -->
            <div id="brand-public-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="col-span-full p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    Memuat data aset branding...
                </div>
            </div>

            <!-- MODAL ZOOM GAMBAR (LIGHTBOX) -->
            <div id="image-zoom-modal-pub" class="hidden fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
                <div class="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                    <button id="btn-close-zoom-pub" class="absolute -top-10 right-0 text-white hover:text-slate-300 p-2 text-lg font-bold cursor-pointer">✕ Tutup</button>
                    <img id="zoomed-image-pub-el" src="" alt="Zoomed" class="max-w-full max-h-[85vh] object-contain border border-slate-700 shadow-2xl bg-black">
                </div>
            </div>
        </div>
    `;
}

export async function initBrandPublicHandler() {
    const container = document.getElementById('brand-public-grid');
    const filterLokasi = document.getElementById('filter-public-lokasi');
    const filterKategori = document.getElementById('filter-public-kategori');
    const filterStatus = document.getElementById('filter-public-status');
    const searchInput = document.getElementById('search-public-branding');
    const badgeTotal = document.getElementById('badge-total-public');

    const zoomModal = document.getElementById('image-zoom-modal-pub');
    const zoomedImageEl = document.getElementById('zoomed-image-pub-el');
    const btnCloseZoom = document.getElementById('btn-close-zoom-pub');

    if (!container) return;

    let allBrandList = [];
    let companyPhone = "081328000001"; // Default fallback

    // Global Zoom Handler
    window.zoomImagePub = (imgUrl) => {
        if (zoomedImageEl && zoomModal) {
            zoomedImageEl.src = decodeURIComponent(imgUrl);
            zoomModal.classList.remove('hidden');
        }
    };

    if (btnCloseZoom) {
        btnCloseZoom.onclick = () => {
            if (zoomModal) zoomModal.classList.add('hidden');
        };
    }

    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) zoomModal.classList.add('hidden');
        };
    }

    const formatRupiah = (number) => {
        if (!number && number !== 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    // Ambil nomor WhatsApp dari profil perusahaan di database
    const loadCompanyProfile = async () => {
        try {
            const docRef = doc(db, "pengaturan", "profil_perusahaan");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().telepon) {
                companyPhone = docSnap.data().telepon;
            }
        } catch (err) {
            console.error("Gagal memuat profil perusahaan:", err);
        }
    };

    // Load Lokasi dari koleksi Firestore `toko_cabang`
    const loadLokasiDropdown = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "toko_cabang"));
            let listLokasi = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.nama) listLokasi.push(data.nama);
            });

            if (listLokasi.length === 0) {
                listLokasi = ["Maga 1 Swalayan", "Maga 2 Swalayan", "Maga 3 Swalayan"];
            }

            let html = `<option value="">-- Semua Lokasi --</option>`;
            listLokasi.forEach((lok) => {
                html += `<option value="${lok}">${lok}</option>`;
            });
            if (filterLokasi) filterLokasi.innerHTML = html;
        } catch (err) {
            console.error("Gagal memuat lokasi cabang:", err);
        }
    };

    const renderGrid = (data) => {
        if (badgeTotal) {
            badgeTotal.textContent = `Total: ${data.length} Aset`;
        }

        if (data.length === 0) {
            container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">Tidak ada data aset branding yang sesuai dengan filter.</div>`;
            return;
        }

        let html = "";
        data.forEach((item) => {
            const imgUrl = item.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
            const statusPesan = item.statusPesan || "Belum Dipesan";
            const badgeClass = statusPesan === "Sudah Dipesan" 
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
                : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";

            let formattedPhone = companyPhone.replace(/[^0-9]/g, '');
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '62' + formattedPhone.slice(1);
            }

            // Pesan WhatsApp yang dioptimalkan agar tidak terjadi error koneksi
            const waMessage = encodeURIComponent(`Halo Admin Swalayan Maga, saya ingin memesan titik branding berikut:\n\n• Kode Aset: ${item.kodeAset || '-'}\n• Nama Aset: ${item.nama}\n• Lokasi: ${item.lokasi || '-'}\n• Kategori: ${item.kategori || '-'}\n\nMohon informasi selanjutnya. Terima kasih.`);
            const waLink = `https://wa.me/${formattedPhone}?text=${waMessage}`;

            html += `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-none flex flex-col justify-between overflow-hidden">
                    <div>
                        <div class="h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative cursor-pointer" onclick="window.zoomImagePub('${encodeURIComponent(imgUrl)}')" title="Klik untuk memperbesar gambar">
                            <img src="${imgUrl}" alt="${item.nama}" class="w-full h-full object-cover">
                            <span class="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-semibold border ${badgeClass} rounded-none shadow-xs">
                                ${statusPesan}
                            </span>
                        </div>
                        <div class="p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">${item.kodeAset || '-'}</span>
                                <span class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">${item.kategori || '-'}</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">${item.nama}</h3>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Lokasi: <span class="font-medium text-slate-700 dark:text-slate-300">${item.lokasi || '-'}</span> (Tahun: ${item.tahun || '-'})</p>
                            </div>
                            <div class="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800">
                                <div class="flex justify-between items-center text-xs">
                                    <span class="text-slate-500 dark:text-slate-400">Harga Bulanan:</span>
                                    <span class="font-semibold text-slate-800 dark:text-slate-200">${formatRupiah(item.hargaBulan)}</span>
                                </div>
                                <div class="flex justify-between items-center text-xs">
                                    <span class="text-slate-500 dark:text-slate-400">Harga Tahunan:</span>
                                    <span class="font-semibold text-slate-800 dark:text-slate-200">${formatRupiah(item.hargaTahun)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 pt-0">
                        <a href="${waLink}" target="_blank" class="w-full py-2 bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white text-xs font-semibold transition rounded-none flex items-center justify-center gap-1.5 text-center cursor-pointer">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            ${statusPesan === 'Sudah Dipesan' ? 'Sudah Dipesan' : 'Pesan via WhatsApp'}
                        </a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    };

    const applyFilters = () => {
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const locVal = filterLokasi ? filterLokasi.value : "";
        const katVal = filterKategori ? filterKategori.value : "";
        const statVal = filterStatus ? filterStatus.value : "";

        const filtered = allBrandList.filter(item => {
            const matchKeyword = 
                item.nama.toLowerCase().includes(keyword) || 
                (item.kodeAset && item.kodeAset.toLowerCase().includes(keyword)) ||
                (item.lokasi && item.lokasi.toLowerCase().includes(keyword));

            const matchLoc = locVal === "" || item.lokasi === locVal;
            const matchKat = katVal === "" || item.kategori === katVal;
            const matchStat = statVal === "" || (item.statusPesan || "Belum Dipesan") === statVal;

            return matchKeyword && matchLoc && matchKat && matchStat;
        });

        renderGrid(filtered);
    };

    try {
        await loadCompanyProfile();
        await loadLokasiDropdown();
        const querySnapshot = await getDocs(collection(db, "branding"));
        allBrandList = [];
        querySnapshot.forEach((docSnap) => {
            allBrandList.push({ id: docSnap.id, ...docSnap.data() });
        });

        applyFilters();

        if (searchInput) searchInput.oninput = applyFilters;
        if (filterLokasi) filterLokasi.onchange = applyFilters;
        if (filterKategori) filterKategori.onchange = applyFilters;
        if (filterStatus) filterStatus.onchange = applyFilters;

    } catch (err) {
        console.error("Gagal memuat data branding publik:", err);
        container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">Gagal memuat data aset branding dari database.</div>`;
    }
}