import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderManajemenProduk() {
    return `
        <div class="space-y-4 sm:space-y-6 max-w-7xl mx-auto relative px-2 sm:px-0 pb-10">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Halaman & Tombol Kembali -->
            <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex items-center gap-3">
                    <a href="#/manajemen" data-link class="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition rounded-none" title="Kembali ke Manajemen">
                        <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        <span>Kembali</span>
                    </a>
                    <div>
                        <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Manajemen Produk</h1>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola informasi produk, harga, diskon, dan periode promo toko.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div class="relative flex-1 md:w-64">
                        <input type="text" id="search-produk" placeholder="Cari produk..." class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition pr-8 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        <svg class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <button id="btn-open-modal" class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-none text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                        Tambah Produk
                    </button>
                </div>
            </div>

            <!-- Kontainer Data Produk (Responsive: Card untuk Mobile, Tabel untuk Desktop) -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <!-- TAMPILAN DESKTOP (Tabel) -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px]">
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-10 text-center"><input type="checkbox" class="rounded-none"></th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-24 text-center">Foto (4:5)</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800">Nama Produk</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-28">Harga Awal</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-20 text-center">Diskon</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-28">Harga Diskon</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-36">Periode Promo</th>
                                <th class="p-3 border-r border-slate-200 dark:border-slate-800 w-20 text-center">Status</th>
                                <th class="p-3 text-center w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="table-produk-body" class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            <tr>
                                <td colspan="9" class="p-6 text-center text-slate-400">Memuat data produk...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- TAMPILAN MOBILE (Card List) -->
                <div id="mobile-produk-container" class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    <div class="p-6 text-center text-slate-400 text-xs">Memuat data produk...</div>
                </div>

                <!-- Pagination Footer -->
                <div class="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                    <div>Menampilkan data produk toko</div>
                    <div class="flex items-center gap-1">
                        <button class="px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition rounded-none">Previous</button>
                        <button class="px-3 py-1 border border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-700 text-white rounded-none font-semibold">1</button>
                        <button class="px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition rounded-none">Next</button>
                    </div>
                </div>
            </div>

            <!-- MODAL TAMBAH / EDIT PRODUK -->
            <div id="modal-produk" class="hidden fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-3xl w-full shadow-2xl rounded-none relative overflow-hidden">
                    <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
                        <h3 id="modal-title" class="font-bold text-slate-800 dark:text-slate-100 text-sm">Tambah Produk Baru</h3>
                        <button type="button" id="btn-close-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-tambah-produk" class="p-6 space-y-4">
                        <input type="hidden" id="produk-id">
                        <input type="hidden" id="produk-img-base64">
                        <input type="hidden" id="produk-harga-awal-raw" value="0">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Produk</label>
                                    <input type="text" id="produk-nama" required class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Misal: Minyak Goreng">
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Harga Awal (Rp)</label>
                                    <input type="text" id="produk-harga-awal" required class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Misal: 15.000">
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Diskon (%)</label>
                                        <input type="number" id="produk-diskon-persen" min="0" max="100" value="0" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="0">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Harga Setelah Diskon</label>
                                        <input type="text" id="produk-harga-akhir-preview" readonly class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none bg-slate-50 dark:bg-slate-800/60 font-semibold text-indigo-700 dark:text-indigo-300" placeholder="Rp 0">
                                    </div>
                                </div>

                                <!-- Periode Promo -->
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mulai Promo</label>
                                        <input type="date" id="produk-promo-mulai" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selesai Promo</label>
                                        <input type="date" id="produk-promo-selesai" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Gambar (Maks. 500px)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="file" id="produk-file" accept="image/*" class="hidden">
                                        <input type="text" id="produk-file-name" readonly placeholder="Tidak ada yang dipilih" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                                        <button type="button" id="btn-browse-file" class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 text-xs font-semibold rounded-none whitespace-nowrap cursor-pointer">Pilih File</button>
                                    </div>
                                    <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Otomatis dikompresi maksimal 500 piksel.</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pratinjau Gambar (4:5)</label>
                                <div id="preview-container" class="h-[380px] w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden relative">
                                    <span class="text-xs text-slate-400 dark:text-slate-500 text-center px-2">Pratinjau Gambar (4:5)</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button type="submit" id="btn-save-produk" class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-2.5 text-xs font-semibold transition rounded-none cursor-pointer shadow-md">
                                Simpan Produk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function initManajemenProdukHandler() {
    const tableBody = document.getElementById('table-produk-body');
    const mobileContainer = document.getElementById('mobile-produk-container');
    const modal = document.getElementById('modal-produk');
    const modalTitle = document.getElementById('modal-title');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnBrowse = document.getElementById('btn-browse-file');
    const inputFile = document.getElementById('produk-file');
    const inputFileName = document.getElementById('produk-file-name');
    const inputId = document.getElementById('produk-id');
    const inputBase64 = document.getElementById('produk-img-base64');
    const previewContainer = document.getElementById('preview-container');
    const form = document.getElementById('form-tambah-produk');
    const searchInput = document.getElementById('search-produk');
    
    const inputNama = document.getElementById('produk-nama');
    const inputHargaAwal = document.getElementById('produk-harga-awal');
    const inputHargaAwalRaw = document.getElementById('produk-harga-awal-raw');
    const inputDiskonPersen = document.getElementById('produk-diskon-persen');
    const inputHargaAkhirPreview = document.getElementById('produk-harga-akhir-preview');
    const inputPromoMulai = document.getElementById('produk-promo-mulai');
    const inputPromoSelesai = document.getElementById('produk-promo-selesai');

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

    let produkData = [];

    function showToast(message, type = 'success') {
        if (!toast || !toastContent) return;
        if (type === 'success') {
            toastContent.className = "px-4 py-3 shadow-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 rounded-none w-full";
            toastContent.innerHTML = `<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span>${message}</span>`;
        } else {
            toastContent.className = "px-4 py-3 shadow-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-200 text-xs font-medium flex items-center gap-2 rounded-none w-full";
            toastContent.innerHTML = `<svg class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg><span>${message}</span>`;
        }
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.remove('translate-y-[-1rem]', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-[-1rem]', 'opacity-0');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

    if (inputHargaAwal) {
        inputHargaAwal.oninput = (e) => {
            let val = e.target.value.replace(/\D/g, '');
            inputHargaAwalRaw.value = val;
            
            if (val !== '') {
                e.target.value = Number(val).toLocaleString('id-ID');
            } else {
                e.target.value = '';
            }
            hitungHargaAkhir();
        };
    }

    const hitungHargaAkhir = () => {
        const hargaAwal = parseFloat(inputHargaAwalRaw.value) || 0;
        const diskon = parseFloat(inputDiskonPersen.value) || 0;
        const hargaAkhir = hargaAwal - (hargaAwal * diskon / 100);
        if (inputHargaAkhirPreview) {
            inputHargaAkhirPreview.value = "Rp " + Math.max(0, hargaAkhir).toLocaleString('id-ID');
        }
    };

    if (inputDiskonPersen) inputDiskonPersen.oninput = hitungHargaAkhir;

    if (btnOpenModal && modal) {
        btnOpenModal.onclick = () => {
            if (modalTitle) modalTitle.textContent = "Tambah Produk Baru";
            if (form) form.reset();
            if (inputId) inputId.value = "";
            if (inputHargaAwalRaw) inputHargaAwalRaw.value = "0";
            if (inputHargaAkhirPreview) inputHargaAkhirPreview.value = "Rp 0";
            if (inputFileName) inputFileName.value = "Tidak ada yang dipilih";
            if (inputBase64) inputBase64.value = "";
            if (previewContainer) previewContainer.innerHTML = `<span class="text-xs text-slate-400 dark:text-slate-500 text-center px-2">Pratinjau Gambar (4:5)</span>`;
            modal.classList.remove('hidden');
        };
    }

    if (btnCloseModal && modal) {
        btnCloseModal.onclick = () => modal.classList.add('hidden');
    }
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        };
    }

    if (btnBrowse && inputFile) {
        btnBrowse.onclick = () => inputFile.click();
    }

    const compressImage = (file, maxDimension = 500, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxDimension) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        }
                    } else {
                        if (height > maxDimension) {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    let dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    if (inputFile) {
        inputFile.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                inputFileName.value = file.name;
                try {
                    const compressedBase64 = await compressImage(file, 500, 0.8);
                    inputBase64.value = compressedBase64;
                    previewContainer.innerHTML = `<img src="${compressedBase64}" alt="Preview" class="w-full h-full object-contain max-h-[380px]">`;
                } catch (err) {
                    console.error("Gagal kompres gambar:", err);
                    showToast("Gagal memproses gambar.", "error");
                }
            }
        };
    }

    const loadProduk = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "produk"));
            produkData = [];
            const todayStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

            for (const docSnap of querySnapshot.docs) {
                let item = { id: docSnap.id, ...docSnap.data() };

                // Periksa apakah ada tanggal selesai promo dan apakah sudah kedaluwarsa
                if (item.promoSelesai && item.status === true) {
                    if (todayStr > item.promoSelesai) {
                        // Otomatis ubah status menjadi non-aktif di database jika melewati tanggal selesai promo
                        try {
                            await updateDoc(doc(db, "produk", item.id), { status: false });
                            item.status = false;
                        } catch (updateErr) {
                            console.error("Gagal memperbarui status promo kedaluwarsa:", updateErr);
                        }
                    }
                }

                produkData.push(item);
            }
            renderDataViews(produkData);
        } catch (err) {
            console.error("Gagal memuat produk:", err);
            if (tableBody) tableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-red-500">Gagal memuat data produk.</td></tr>`;
            if (mobileContainer) mobileContainer.innerHTML = `<div class="p-6 text-center text-red-500 text-xs">Gagal memuat data produk.</div>`;
        }
    };

    const renderDataViews = (data) => {
        if (!tableBody || !mobileContainer) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-slate-400">Belum ada data produk.</td></tr>`;
            mobileContainer.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">Belum ada data produk.</div>`;
            return;
        }

        let tableHtml = '';
        let mobileHtml = '';

        data.forEach((item) => {
            const isActive = item.status !== false;
            const hargaAwal = parseFloat(item.hargaAwal) || 0;
            const diskon = parseFloat(item.diskonPersen) || 0;
            const hargaAkhir = diskon > 0 ? hargaAwal - (hargaAwal * diskon / 100) : hargaAwal;

            const hargaAwalStr = "Rp " + hargaAwal.toLocaleString('id-ID');
            const diskonStr = diskon > 0 ? `<span class="text-xs bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-1.5 py-0.5 font-semibold">${diskon}%</span>` : `<span class="text-slate-400 dark:text-slate-500">-</span>`;
            const hargaAkhirStr = "Rp " + hargaAkhir.toLocaleString('id-ID');
            
            let periodeStr = '-';
            if (item.promoMulai || item.promoSelesai) {
                periodeStr = `${item.promoMulai || '...'} s/d ${item.promoSelesai || '...'}`;
            }

            // Tombol Aksi (Edit & Hapus)
            const actionButtons = `
                <div class="flex items-center justify-center gap-1.5">
                    <button class="btn-edit p-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition rounded-none cursor-pointer" data-id="${item.id}" title="Edit Produk">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="btn-delete p-1.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 transition rounded-none cursor-pointer" data-id="${item.id}" title="Hapus Produk">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            `;

            // Tabel Desktop
            tableHtml += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-center"><input type="checkbox" class="rounded-none"></td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800">
                        <div class="h-16 w-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center mx-auto">
                            ${item.gambar ? `<img src="${item.gambar}" alt="Produk" class="w-full h-full object-cover">` : `<span class="text-[9px] text-slate-400">No Image</span>`}
                        </div>
                    </td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100">${item.nama || '-'}</td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">${hargaAwalStr}</td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-center">${diskonStr}</td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 font-semibold text-indigo-700 dark:text-indigo-400">${hargaAkhirStr}</td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">${periodeStr}</td>
                    <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer toggle-status" data-id="${item.id}" ${isActive ? 'checked' : ''}>
                            <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                        </label>
                    </td>
                    <td class="p-3 text-center">${actionButtons}</td>
                </tr>
            `;

            // Card Mobile
            mobileHtml += `
                <div class="p-4 flex gap-3 items-center bg-white dark:bg-slate-900 justify-between">
                    <div class="flex gap-3 items-center min-w-0">
                        <div class="h-20 w-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                            ${item.gambar ? `<img src="${item.gambar}" alt="Produk" class="w-full h-full object-cover">` : `<span class="text-[8px] text-slate-400">No Img</span>`}
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-xs truncate mb-1">${item.nama || '-'}</h3>
                            <div class="text-xs space-y-0.5">
                                <p class="text-slate-500 dark:text-slate-400 line-through">Awal: ${hargaAwalStr}</p>
                                <p class="font-semibold text-indigo-700 dark:text-indigo-400">Diskon: ${hargaAkhirStr} ${diskon > 0 ? `(${diskon}%)` : ''}</p>
                                <p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Promo: ${periodeStr}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-2 flex-shrink-0">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer toggle-status" data-id="${item.id}" ${isActive ? 'checked' : ''}>
                            <div class="w-8 h-4 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                        </label>
                        ${actionButtons}
                    </div>
                </div>
            `;
        });

        tableBody.innerHTML = tableHtml;
        mobileContainer.innerHTML = mobileHtml;

        // Handler Toggle Status
        document.querySelectorAll('.toggle-status').forEach((chk) => {
            chk.onchange = async (e) => {
                const id = e.target.getAttribute('data-id');
                const newStatus = e.target.checked;
                try {
                    await updateDoc(doc(db, "produk", id), { status: newStatus });
                    showToast("Status produk berhasil diperbarui.", "success");
                } catch (err) {
                    console.error("Gagal update status:", err);
                    showToast("Gagal memperbarui status.", "error");
                    e.target.checked = !newStatus;
                }
            };
        });

        // Handler Tombol Edit
        document.querySelectorAll('.btn-edit').forEach((btn) => {
            btn.onclick = (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const item = produkData.find(p => p.id === id);
                if (!item) return;

                if (modalTitle) modalTitle.textContent = "Edit Produk";
                if (inputId) inputId.value = item.id;
                if (inputNama) inputNama.value = item.nama || '';
                
                const hargaAwalVal = item.hargaAwal || 0;
                if (inputHargaAwalRaw) inputHargaAwalRaw.value = hargaAwalVal;
                if (inputHargaAwal) inputHargaAwal.value = Number(hargaAwalVal).toLocaleString('id-ID');

                if (inputDiskonPersen) inputDiskonPersen.value = item.diskonPersen || 0;
                if (inputPromoMulai) inputPromoMulai.value = item.promoMulai || '';
                if (inputPromoSelesai) inputPromoSelesai.value = item.promoSelesai || '';

                if (inputBase64) inputBase64.value = item.gambar || '';
                if (inputFileName) inputFileName.value = item.gambar ? "Gambar tersimpan" : "Tidak ada yang dipilih";

                if (previewContainer) {
                    if (item.gambar) {
                        previewContainer.innerHTML = `<img src="${item.gambar}" alt="Preview" class="w-full h-full object-contain max-h-[380px]">`;
                    } else {
                        previewContainer.innerHTML = `<span class="text-xs text-slate-400 dark:text-slate-500 text-center px-2">Pratinjau Gambar (4:5)</span>`;
                    }
                }

                hitungHargaAkhir();
                if (modal) modal.classList.remove('hidden');
            };
        });

        // Handler Tombol Hapus
        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.onclick = async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                    try {
                        await deleteDoc(doc(db, "produk", id));
                        showToast("Produk berhasil dihapus.", "success");
                        loadProduk();
                    } catch (err) {
                        console.error("Gagal menghapus produk:", err);
                        showToast("Gagal menghapus produk.", "error");
                    }
                }
            };
        });
    };

    loadProduk();

    if (searchInput) {
        searchInput.oninput = (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = produkData.filter(item => 
                (item.nama && item.nama.toLowerCase().includes(keyword))
            );
            renderDataViews(filtered);
        };
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = inputId ? inputId.value : '';
            const nama = inputNama.value;
            const hargaAwal = parseFloat(inputHargaAwalRaw.value) || 0;
            const diskonPersen = parseFloat(inputDiskonPersen.value) || 0;
            const hargaAkhir = hargaAwal - (hargaAwal * diskonPersen / 100);
            const promoMulai = inputPromoMulai ? inputPromoMulai.value : '';
            const promoSelesai = inputPromoSelesai ? inputPromoSelesai.value : '';
            const base64Img = inputBase64.value;
            const btnSave = document.getElementById('btn-save-produk');

            if (btnSave) {
                btnSave.disabled = true;
                btnSave.textContent = "Menyimpan...";
            }

            try {
                const payload = {
                    nama: nama,
                    hargaAwal: hargaAwal,
                    diskonPersen: diskonPersen,
                    hargaAkhir: hargaAkhir,
                    promoMulai: promoMulai,
                    promoSelesai: promoSelesai,
                    gambar: base64Img || '',
                    updatedAt: new Date().toISOString()
                };

                if (id) {
                    // Update data produk yang ada
                    await updateDoc(doc(db, "produk", id), payload);
                    showToast("Produk berhasil diperbarui!", "success");
                } else {
                    // Tambah data produk baru
                    payload.status = true;
                    payload.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "produk"), payload);
                    showToast("Produk berhasil ditambahkan!", "success");
                }

                modal.classList.add('hidden');
                form.reset();
                if (inputId) inputId.value = "";
                inputHargaAwalRaw.value = "0";
                inputHargaAkhirPreview.value = "Rp 0";
                inputFileName.value = "Tidak ada yang dipilih";
                inputBase64.value = "";
                previewContainer.innerHTML = `<span class="text-xs text-slate-400 dark:text-slate-500 text-center px-2">Pratinjau Gambar (4:5)</span>`;
                loadProduk();
            } catch (err) {
                console.error("Gagal menyimpan produk:", err);
                showToast("Terjadi kesalahan saat menyimpan produk.", "error");
            } finally {
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.textContent = "Simpan Produk";
                }
            }
        };
    }
}