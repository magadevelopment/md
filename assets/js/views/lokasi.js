import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderToko() {
    return `
        <div class="space-y-6 max-w-5xl mx-auto relative pb-12">
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
                        <h1 class="text-xl font-bold text-slate-800">Manajemen Toko Cabang</h1>
                        <p class="text-xs text-slate-500 mt-0.5">Kelola daftar cabang Swalayan Maga, informasi alamat, foto, dan titik lokasi Maps.</p>
                    </div>
                </div>
                <button id="btn-open-modal" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center justify-center gap-2 rounded-none cursor-pointer flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Tambah Cabang Baru
                </button>
            </div>

            <!-- List / Grid Card Cabang Toko -->
            <div id="toko-grid-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">
                    Memuat data cabang toko...
                </div>
            </div>

            <!-- MODAL FORM TAMBAH / EDIT CABANG -->
            <div id="toko-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                <div class="bg-white border border-slate-200 w-full max-w-xl shadow-2xl rounded-none overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 id="modal-title" class="font-bold text-slate-800 text-sm">Tambah Cabang Toko Baru</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-toko" class="p-6 space-y-4">
                        <input type="hidden" id="toko-id">
                        <input type="hidden" id="toko-gambar-base64">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Cabang / Toko</label>
                            <input type="text" id="toko-nama" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Contoh: Swalayan Maga Cabang 1">
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Kode Toko / ID</label>
                                <input type="text" id="toko-kode" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Contoh: MAGA-01">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                                <input type="text" id="toko-telepon" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Contoh: 08123456789">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                            <textarea id="toko-alamat" rows="2" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="Masukkan alamat lengkap cabang..."></textarea>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Upload Foto Toko (Maks. 500px)</label>
                                <input type="file" id="toko-file" accept="image/*" class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-none focus:outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                                <p class="text-[10px] text-slate-400 mt-1">Otomatis diresize & dikompresi maksimal 500 piksel.</p>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Pratinjau Foto</label>
                                <div id="preview-container" class="h-28 w-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                    <span class="text-xs text-slate-400 text-center px-2">Belum ada foto</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">URL / Link Google Maps</label>
                            <input type="url" id="toko-maps" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600" placeholder="https://maps.app.goo.gl/... atau koordinat embed">
                        </div>
                        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition rounded-none">
                                Batal
                            </button>
                            <button type="submit" id="btn-save-toko" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                                Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function initTokoHandler() {
    const container = document.getElementById('toko-grid-container');
    const modal = document.getElementById('toko-modal');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-toko');
    const modalTitle = document.getElementById('modal-title');
    
    const inputId = document.getElementById('toko-id');
    const inputNama = document.getElementById('toko-nama');
    const inputKode = document.getElementById('toko-kode');
    const inputTelepon = document.getElementById('toko-telepon');
    const inputAlamat = document.getElementById('toko-alamat');
    const inputFile = document.getElementById('toko-file');
    const inputGambarBase64 = document.getElementById('toko-gambar-base64');
    const inputMaps = document.getElementById('toko-maps');
    const previewContainer = document.getElementById('preview-container');

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

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
                try {
                    const compressedBase64 = await compressImage(file, 500, 0.8);
                    inputGambarBase64.value = compressedBase64;
                    previewContainer.innerHTML = `<img src="${compressedBase64}" alt="Preview" class="w-full h-full object-cover">`;
                } catch (err) {
                    console.error("Gagal memproses gambar:", err);
                    showToast("Gagal memproses file gambar.", "error");
                }
            }
        };
    }

    const loadTokoData = async () => {
        if (!container) return;
        try {
            const querySnapshot = await getDocs(collection(db, "toko_cabang"));
            let tokoList = [];
            querySnapshot.forEach((docSnap) => {
                tokoList.push({ id: docSnap.id, ...docSnap.data() });
            });

            if (tokoList.length === 0) {
                container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">Belum ada data cabang toko yang ditambahkan.</div>`;
                return;
            }

            let html = "";
            tokoList.forEach((toko) => {
                const imgPlaceholder = toko.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
                html += `
                    <div class="bg-white border border-slate-200 shadow-xs rounded-none flex flex-col justify-between overflow-hidden">
                        <div>
                            <div class="h-40 w-full bg-slate-100 overflow-hidden relative">
                                <img src="${imgPlaceholder}" alt="${toko.nama}" class="w-full h-full object-cover">
                                <span class="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-none">${toko.kode || 'CABANG'}</span>
                            </div>
                            <div class="p-4 space-y-2">
                                <h3 class="font-bold text-slate-800 text-sm">${toko.nama}</h3>
                                <p class="text-xs text-slate-600 flex items-start gap-1.5">
                                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    <span>${toko.alamat || 'Alamat belum diatur'}</span>
                                </p>
                                <p class="text-xs text-slate-600 flex items-center gap-1.5">
                                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    <span>${toko.telepon || '-'}</span>
                                </p>
                            </div>
                        </div>
                        <div class="p-4 pt-0 flex items-center justify-between border-t border-slate-100 bg-slate-50 mt-4">
                            ${toko.maps ? `<a href="${toko.maps}" target="_blank" class="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Buka Maps</a>` : '<span class="text-[11px] text-slate-400">Maps belum ada</span>'}
                            <div class="flex items-center gap-2">
                                <button onclick="window.editToko('${toko.id}', '${encodeURIComponent(toko.nama)}', '${encodeURIComponent(toko.kode)}', '${encodeURIComponent(toko.telepon || '')}', '${encodeURIComponent(toko.alamat)}', '${encodeURIComponent(toko.gambar || '')}', '${encodeURIComponent(toko.maps || '')}')" class="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition rounded-none">Edit</button>
                                <button onclick="window.deleteToko('${toko.id}')" class="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition rounded-none">Hapus</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        } catch (err) {
            console.error("Gagal memuat data toko:", err);
            container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white border border-slate-200">Gagal memuat data cabang toko.</div>`;
        }
    };

    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (form) form.reset();
            if (inputId) inputId.value = '';
            if (inputGambarBase64) inputGambarBase64.value = '';
            if (inputFile) inputFile.value = '';
            if (previewContainer) previewContainer.innerHTML = `<span class="text-xs text-slate-400 text-center px-2">Belum ada foto</span>`;
            if (modalTitle) modalTitle.textContent = "Tambah Cabang Toko Baru";
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

            const payload = {
                nama: inputNama.value,
                kode: inputKode.value,
                telepon: inputTelepon.value,
                alamat: inputAlamat.value,
                maps: inputMaps.value,
                updatedAt: new Date().toISOString()
            };

            if (gambarVal) {
                payload.gambar = gambarVal;
            }

            try {
                if (id) {
                    await updateDoc(doc(db, "toko_cabang", id), payload);
                    showToast("Data cabang toko berhasil diperbarui!", "success");
                } else {
                    payload.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "toko_cabang"), payload);
                    showToast("Cabang toko baru berhasil ditambahkan!", "success");
                }
                closeModal();
                loadTokoData();
            } catch (err) {
                console.error("Gagal menyimpan data toko:", err);
                showToast("Terjadi kesalahan saat menyimpan data.", "error");
            }
        };
    }

    window.editToko = (id, nama, kode, telepon, alamat, gambar, maps) => {
        if (inputId) inputId.value = id;
        if (inputNama) inputNama.value = decodeURIComponent(nama);
        if (inputKode) inputKode.value = decodeURIComponent(kode);
        if (inputTelepon) inputTelepon.value = decodeURIComponent(telepon);
        if (inputAlamat) inputAlamat.value = decodeURIComponent(alamat);
        if (inputMaps) inputMaps.value = decodeURIComponent(maps);
        
        const decodedGambar = decodeURIComponent(gambar);
        if (inputGambarBase64) inputGambarBase64.value = decodedGambar;
        if (inputFile) inputFile.value = '';
        if (previewContainer) {
            if (decodedGambar) {
                previewContainer.innerHTML = `<img src="${decodedGambar}" alt="Preview" class="w-full h-full object-cover">`;
            } else {
                previewContainer.innerHTML = `<span class="text-xs text-slate-400 text-center px-2">Belum ada foto</span>`;
            }
        }

        if (modalTitle) modalTitle.textContent = "Edit Data Cabang Toko";
        if (modal) modal.classList.remove('hidden');
    };

    window.deleteToko = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data cabang toko ini?")) return;
        try {
            await deleteDoc(doc(db, "toko_cabang", id));
            showToast("Cabang toko berhasil dihapus.", "success");
            loadTokoData();
        } catch (err) {
            console.error("Gagal menghapus toko:", err);
            showToast("Gagal menghapus data toko.", "error");
        }
    };

    loadTokoData();
}