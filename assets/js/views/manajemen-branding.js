import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderBranding() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto relative pb-12">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Title & Action -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-slate-200">
                <div class="flex items-center gap-3">
                    <a href="#/manajemen" data-link class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 rounded-none">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Kembali
                    </a>
                    <div>
                        <h1 class="text-xl font-bold text-slate-800">Manajemen Branding</h1>
                        <p class="text-xs text-slate-500 mt-0.5">Kelola materi promosi, logo, aset branding, harga sewa, dan status pemesanan Swalayan Maga.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="relative w-full sm:w-64">
                        <input type="text" id="search-branding" placeholder="Cari aset branding..." class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 pr-8">
                        <svg class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <button id="btn-open-modal" class="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition flex items-center justify-center gap-2 rounded-none cursor-pointer flex-shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Tambah Aset
                    </button>
                </div>
            </div>

            <!-- Container Data (Responsive Table for Desktop & Card List for Mobile) -->
            <div id="branding-container">
                <div class="p-8 text-center text-slate-400 bg-white border border-slate-200 text-xs">Memuat data branding...</div>
            </div>

            <!-- MODAL FORM TAMBAH / EDIT BRANDING -->
            <div id="branding-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                <div class="bg-white border border-slate-200 w-full max-w-2xl shadow-2xl rounded-none overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 id="modal-title" class="font-bold text-slate-800 text-sm">Tambah Aset Branding Baru</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-branding" class="p-6 space-y-4">
                        <input type="hidden" id="branding-id">
                        <input type="hidden" id="branding-gambar-base64">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Nama / Judul Aset</label>
                                    <input type="text" id="branding-nama" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Misal: Titik Promo Depan Kasir">
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1">Harga Bulanan (Rp)</label>
                                        <input type="text" id="branding-harga-bulan" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="0">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1">Harga Tahunan (Rp)</label>
                                        <input type="text" id="branding-harga-tahun" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="0">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Status Pemesanan</label>
                                    <select id="branding-status-pesan" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 bg-white">
                                        <option value="Belum Dipesan">Belum Dipesan</option>
                                        <option value="Sudah Dipesan">Sudah Dipesan</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Upload File Gambar Aset</label>
                                    <input type="file" id="branding-file" accept="image/*" class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-none focus:outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                                    <p class="text-[10px] text-slate-400 mt-1">Otomatis dikompresi (Maks. 500 KB).</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Pratinjau Aset Branding</label>
                                <div id="preview-container" class="h-48 w-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                    <span class="text-xs text-slate-400 text-center px-4">Pratinjau Gambar Aset</span>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition rounded-none">
                                Batal
                            </button>
                            <button type="submit" id="btn-save-branding" class="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                                Simpan Aset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function initBrandingHandler() {
    const container = document.getElementById('branding-container');
    const modal = document.getElementById('branding-modal');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-branding');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-branding');

    const inputId = document.getElementById('branding-id');
    const inputNama = document.getElementById('branding-nama');
    const inputHargaBulan = document.getElementById('branding-harga-bulan');
    const inputHargaTahun = document.getElementById('branding-harga-tahun');
    const inputStatusPesan = document.getElementById('branding-status-pesan');
    const inputFile = document.getElementById('branding-file');
    const inputGambarBase64 = document.getElementById('branding-gambar-base64');
    const previewContainer = document.getElementById('preview-container');

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

    let allBrandings = [];

    function showToast(message, type = 'success') {
        if (!toast || !toastContent) return;
        if (type === 'success') {
            toastContent.className = "px-4 py-3 shadow-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 rounded-none w-full";
            toastContent.innerHTML = `<svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span>${message}</span>`;
        } else {
            toastContent.className = "px-4 py-3 shadow-lg border border-red-200 bg-red-50 text-red-800 text-xs font-medium flex items-center gap-2 rounded-none w-full";
            toastContent.innerHTML = `<svg class="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg><span>${message}</span>`;
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

    const formatRupiahNumber = (value) => {
        if (!value) return '';
        const numberString = value.toString().replace(/[^,\d]/g, '');
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        return split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    };

    const parseRupiahNumber = (value) => {
        if (!value) return 0;
        return Number(value.toString().replace(/\./g, '')) || 0;
    };

    if (inputHargaBulan) {
        inputHargaBulan.oninput = (e) => {
            e.target.value = formatRupiahNumber(e.target.value);
        };
    }
    if (inputHargaTahun) {
        inputHargaTahun.oninput = (e) => {
            e.target.value = formatRupiahNumber(e.target.value);
        };
    }

    const formatRupiahDisplay = (number) => {
        if (!number && number !== 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    const compressImage = (file, maxWidth = 1000, maxHeight = 500, quality = 0.8) => {
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

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
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
                try {
                    const compressedBase64 = await compressImage(file, 1000, 500, 0.75);
                    inputGambarBase64.value = compressedBase64;
                    previewContainer.innerHTML = `<img src="${compressedBase64}" alt="Preview" class="w-full h-full object-cover">`;
                } catch (err) {
                    console.error("Gagal memproses gambar:", err);
                    showToast("Gagal memproses file gambar.", "error");
                }
            }
        };
    }

    const renderView = (data) => {
        if (!container) return;
        if (data.length === 0) {
            container.innerHTML = `
                <div class="bg-white border border-slate-200 p-8 text-center text-slate-400 text-xs">
                    Belum ada data aset branding yang tersedia.
                </div>
            `;
            return;
        }

        // TAMPILAN CARD KHUSUS HP (Tampil di layar kecil md:hidden)
        let mobileHtml = `<div class="grid grid-cols-1 gap-4 md:hidden">`;
        
        // TAMPILAN TABEL UNTUK DESKTOP (Tampil di layar besar hidden md:block)
        let desktopHtml = `
            <div class="hidden md:block bg-white border border-slate-200 overflow-hidden shadow-xs">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                                <th class="p-3 w-12 text-center">
                                    <input type="checkbox" id="select-all" class="rounded-none border-slate-300">
                                </th>
                                <th class="p-3 w-36">Preview</th>
                                <th class="p-3">Nama / Judul Aset</th>
                                <th class="p-3">Harga (Bulan / Tahun)</th>
                                <th class="p-3 w-32 text-center">Status Pesan</th>
                                <th class="p-3 w-28 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
        `;

        data.forEach((item) => {
            const imgUrl = item.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
            const statusPesan = item.statusPesan || "Belum Dipesan";
            const badgeClass = statusPesan === "Sudah Dipesan" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200";

            // Render Mobile Card
            mobileHtml += `
                <div class="bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 text-[10px] font-semibold border ${badgeClass} inline-block rounded-none">
                            ${statusPesan}
                        </span>
                        <div class="flex items-center gap-1.5">
                            <button onclick="window.editBranding('${item.id}', '${encodeURIComponent(item.nama)}', '${item.hargaBulan || 0}', '${item.hargaTahun || 0}', '${statusPesan}', '${encodeURIComponent(item.gambar || '')}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition rounded-none">Edit</button>
                            <button onclick="window.deleteBranding('${item.id}')" class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition rounded-none">Hapus</button>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center">
                        <div class="h-20 w-28 bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            <img src="${imgUrl}" alt="${item.nama}" class="w-full h-full object-cover">
                        </div>
                        <div class="space-y-1 flex-1 min-w-0">
                            <h4 class="font-bold text-slate-800 text-sm truncate">${item.nama}</h4>
                            <div class="text-xs text-slate-600">Bulan: <span class="font-semibold">${formatRupiahDisplay(item.hargaBulan)}</span></div>
                            <div class="text-xs text-slate-500">Tahun: <span class="font-semibold">${formatRupiahDisplay(item.hargaTahun)}</span></div>
                        </div>
                    </div>
                </div>
            `;

            // Render Desktop Table Row
            desktopHtml += `
                <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                    <td class="p-3 text-center">
                        <input type="checkbox" class="rounded-none border-slate-300">
                    </td>
                    <td class="p-3">
                        <div class="h-12 w-24 bg-slate-100 border border-slate-200 overflow-hidden">
                            <img src="${imgUrl}" alt="${item.nama}" class="w-full h-full object-cover">
                        </div>
                    </td>
                    <td class="p-3 font-medium text-slate-800">${item.nama}</td>
                    <td class="p-3">
                        <div class="text-slate-700 font-semibold">Bulan: ${formatRupiahDisplay(item.hargaBulan)}</div>
                        <div class="text-slate-500 text-[11px]">Tahun: ${formatRupiahDisplay(item.hargaTahun)}</div>
                    </td>
                    <td class="p-3 text-center">
                        <span class="px-2.5 py-1 text-[11px] font-semibold border ${badgeClass} inline-block rounded-none">
                            ${statusPesan}
                        </span>
                    </td>
                    <td class="p-3 text-center">
                        <div class="flex items-center justify-center gap-1.5">
                            <button onclick="window.editBranding('${item.id}', '${encodeURIComponent(item.nama)}', '${item.hargaBulan || 0}', '${item.hargaTahun || 0}', '${statusPesan}', '${encodeURIComponent(item.gambar || '')}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition rounded-none">Edit</button>
                            <button onclick="window.deleteBranding('${item.id}')" class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium transition rounded-none">Hapus</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        mobileHtml += `</div>`;
        desktopHtml += `</tbody></table></div></div>`;

        container.innerHTML = mobileHtml + desktopHtml;
    };

    const loadBrandingData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "branding"));
            allBrandings = [];
            querySnapshot.forEach((docSnap) => {
                allBrandings.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderView(allBrandings);
        } catch (err) {
            console.error("Gagal memuat data branding:", err);
            container.innerHTML = `<div class="p-8 text-center text-red-500 bg-white border border-slate-200 text-xs">Gagal memuat data dari database.</div>`;
        }
    };

    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (form) form.reset();
            if (inputId) inputId.value = '';
            if (inputGambarBase64) inputGambarBase64.value = '';
            if (inputStatusPesan) inputStatusPesan.value = 'Belum Dipesan';
            if (inputHargaBulan) inputHargaBulan.value = '';
            if (inputHargaTahun) inputHargaTahun.value = '';
            if (modalTitle) modalTitle.textContent = "Tambah Aset Branding Baru";
            if (previewContainer) previewContainer.innerHTML = `<span class="text-xs text-slate-400 text-center px-4">Pratinjau Gambar Aset</span>`;
            if (modal) modal.classList.remove('hidden');
        };
    }

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    if (closeModalBtn) closeModalBtn.onclick = closeModal;
    if (cancelModalBtn) cancelModalBtn.onclick = closeModal;

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = inputId.value;
            const gambarVal = inputGambarBase64.value;

            if (!id && !gambarVal) {
                showToast("Silakan pilih file gambar aset terlebih dahulu.", "error");
                return;
            }

            const payload = {
                nama: inputNama.value,
                hargaBulan: parseRupiahNumber(inputHargaBulan.value),
                hargaTahun: parseRupiahNumber(inputHargaTahun.value),
                statusPesan: inputStatusPesan.value,
                updatedAt: new Date().toISOString()
            };

            if (gambarVal) {
                payload.gambar = gambarVal;
            }

            try {
                if (id) {
                    await updateDoc(doc(db, "branding", id), payload);
                    showToast("Aset branding berhasil diperbarui!", "success");
                } else {
                    payload.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "branding"), payload);
                    showToast("Aset branding baru berhasil ditambahkan!", "success");
                }
                closeModal();
                loadBrandingData();
            } catch (err) {
                console.error("Gagal menyimpan aset branding:", err);
                showToast("Terjadi kesalahan saat menyimpan data.", "error");
            }
        };
    }

    window.editBranding = (id, nama, hargaBulan, hargaTahun, statusPesan, gambar) => {
        if (inputId) inputId.value = id;
        if (inputNama) inputNama.value = decodeURIComponent(nama);
        if (inputHargaBulan) inputHargaBulan.value = formatRupiahNumber(hargaBulan);
        if (inputHargaTahun) inputHargaTahun.value = formatRupiahNumber(hargaTahun);
        if (inputStatusPesan) inputStatusPesan.value = statusPesan;
        
        const decodedGambar = decodeURIComponent(gambar);
        if (inputGambarBase64) inputGambarBase64.value = decodedGambar;
        if (previewContainer && decodedGambar) {
            previewContainer.innerHTML = `<img src="${decodedGambar}" alt="Preview" class="w-full h-full object-cover">`;
        }
        if (modalTitle) modalTitle.textContent = "Edit Data Aset Branding";
        if (modal) modal.classList.remove('hidden');
    };

    window.deleteBranding = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus aset branding ini?")) return;
        try {
            await deleteDoc(doc(db, "branding", id));
            showToast("Aset branding berhasil dihapus.", "success");
            loadBrandingData();
        } catch (err) {
            console.error("Gagal menghapus aset branding:", err);
            showToast("Gagal menghapus aset branding.", "error");
        }
    };

    if (searchInput) {
        searchInput.oninput = (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = allBrandings.filter(b => b.nama.toLowerCase().includes(keyword));
            renderView(filtered);
        };
    }

    loadBrandingData();
}