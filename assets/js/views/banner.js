import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderBanner() {
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
                        <h1 class="text-xl font-bold text-slate-800">Manajemen Banner</h1>
                        <p class="text-xs text-slate-500 mt-0.5">Kelola banner promosi utama yang tampil pada beranda aplikasi Swalayan Maga.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="relative w-full sm:w-64">
                        <input type="text" id="search-banner" placeholder="Cari banner..." class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 pr-8">
                        <svg class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <button id="btn-open-modal" class="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition flex items-center justify-center gap-2 rounded-none cursor-pointer flex-shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Tambah Banner
                    </button>
                </div>
            </div>

            <!-- Table Banner -->
            <div class="bg-white border border-slate-200 overflow-hidden shadow-xs">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                                <th class="p-3 w-12 text-center">
                                    <input type="checkbox" id="select-all" class="rounded-none border-slate-300">
                                </th>
                                <th class="p-3 w-40">Foto Banner</th>
                                <th class="p-3">Nama / Judul Banner</th>
                                <th class="p-3 w-32 text-center">Status</th>
                                <th class="p-3 w-28 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="banner-table-body" class="divide-y divide-slate-100 text-xs text-slate-700">
                            <tr>
                                <td colspan="5" class="p-8 text-center text-slate-400">Memuat data banner...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- MODAL FORM TAMBAH / EDIT BANNER -->
            <div id="banner-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                <div class="bg-white border border-slate-200 w-full max-w-2xl shadow-2xl rounded-none overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 id="modal-title" class="font-bold text-slate-800 text-sm">Tambah Banner Baru</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-banner" class="p-6 space-y-4">
                        <input type="hidden" id="banner-id">
                        <input type="hidden" id="banner-gambar-base64">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Nama / Judul Banner</label>
                                    <input type="text" id="banner-nama" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Misal: Promo Akhir Tahun">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Upload File Gambar Banner</label>
                                    <input type="file" id="banner-file" accept="image/*" class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-none focus:outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                                    <p class="text-[10px] text-slate-400 mt-1">Otomatis dikompresi (Maks. 500 KB / Resolusi optimal).</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Pratinjau Banner Canva (2:1 / 1000x500mm)</label>
                                <div id="preview-container" class="h-40 w-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                    <span class="text-xs text-slate-400 text-center px-4">Pratinjau Banner Canva (2:1 / 1000x500mm)</span>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition rounded-none">
                                Batal
                            </button>
                            <button type="submit" id="btn-save-banner" class="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                                Simpan Banner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function initBannerHandler() {
    const tableBody = document.getElementById('banner-table-body');
    const modal = document.getElementById('banner-modal');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-banner');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-banner');

    const inputId = document.getElementById('banner-id');
    const inputNama = document.getElementById('banner-nama');
    const inputFile = document.getElementById('banner-file');
    const inputGambarBase64 = document.getElementById('banner-gambar-base64');
    const previewContainer = document.getElementById('preview-container');

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

    let allBanners = [];

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

    const renderTable = (data) => {
        if (!tableBody) return;
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Belum ada data banner yang tersedia.</td></tr>`;
            return;
        }

        let html = "";
        data.forEach((item) => {
            const isActive = item.status !== false;
            const imgUrl = item.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
            html += `
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
                    <td class="p-3 text-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${isActive ? 'checked' : ''} onchange="window.toggleBannerStatus('${item.id}', ${!isActive})" class="sr-only peer">
                            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-900"></div>
                        </label>
                    </td>
                    <td class="p-3 text-center">
                        <div class="flex items-center justify-center gap-1.5">
                            <button onclick="window.editBanner('${item.id}', '${encodeURIComponent(item.nama)}', '${encodeURIComponent(item.gambar || '')}', ${isActive})" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition rounded-none">Edit</button>
                            <button onclick="window.deleteBanner('${item.id}')" class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium transition rounded-none">Hapus</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    };

    const loadBannerData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "banner"));
            allBanners = [];
            querySnapshot.forEach((docSnap) => {
                allBanners.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderTable(allBanners);
        } catch (err) {
            console.error("Gagal memuat data banner:", err);
            tableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-red-500">Gagal memuat data dari database.</td></tr>`;
        }
    };

    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (form) form.reset();
            if (inputId) inputId.value = '';
            if (inputGambarBase64) inputGambarBase64.value = '';
            if (modalTitle) modalTitle.textContent = "Tambah Banner Baru";
            if (previewContainer) previewContainer.innerHTML = `<span class="text-xs text-slate-400 text-center px-4">Pratinjau Banner Canva (2:1 / 1000x500mm)</span>`;
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
                showToast("Silakan pilih file gambar banner terlebih dahulu.", "error");
                return;
            }

            const payload = {
                nama: inputNama.value,
                status: true,
                updatedAt: new Date().toISOString()
            };

            if (gambarVal) {
                payload.gambar = gambarVal;
            }

            try {
                if (id) {
                    await updateDoc(doc(db, "banner", id), payload);
                    showToast("Banner berhasil diperbarui!", "success");
                } else {
                    payload.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "banner"), payload);
                    showToast("Banner baru berhasil ditambahkan!", "success");
                }
                closeModal();
                loadBannerData();
            } catch (err) {
                console.error("Gagal menyimpan banner:", err);
                showToast("Terjadi kesalahan saat menyimpan data.", "error");
            }
        };
    }

    window.editBanner = (id, nama, gambar, status) => {
        if (inputId) inputId.value = id;
        if (inputNama) inputNama.value = decodeURIComponent(nama);
        const decodedGambar = decodeURIComponent(gambar);
        if (inputGambarBase64) inputGambarBase64.value = decodedGambar;
        if (previewContainer && decodedGambar) {
            previewContainer.innerHTML = `<img src="${decodedGambar}" alt="Preview" class="w-full h-full object-cover">`;
        }
        if (modalTitle) modalTitle.textContent = "Edit Data Banner";
        if (modal) modal.classList.remove('hidden');
    };

    window.deleteBanner = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
        try {
            await deleteDoc(doc(db, "banner", id));
            showToast("Banner berhasil dihapus.", "success");
            loadBannerData();
        } catch (err) {
            console.error("Gagal menghapus banner:", err);
            showToast("Gagal menghapus banner.", "error");
        }
    };

    window.toggleBannerStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "banner", id), { status: newStatus });
            showToast("Status banner diperbarui.", "success");
            loadBannerData();
        } catch (err) {
            console.error("Gagal mengubah status:", err);
            showToast("Gagal memperbarui status banner.", "error");
        }
    };

    if (searchInput) {
        searchInput.oninput = (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = allBanners.filter(b => b.nama.toLowerCase().includes(keyword));
            renderTable(filtered);
        };
    }

    loadBannerData();
}