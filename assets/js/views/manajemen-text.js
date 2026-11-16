import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderText() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto relative pb-12 px-2 sm:px-0">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Title & Action -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div class="flex items-center gap-3">
                    <a href="#/manajemen" data-link class="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 rounded-none">
                        <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Kembali
                    </a>
                    <div>
                        <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Running Text</h1>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola teks berjalan dan pengumuman yang tampil pada beranda aplikasi Swalayan Maga.</p>
                    </div>
                </div>
                <button id="btn-open-modal" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold transition flex items-center justify-center gap-2 rounded-none cursor-pointer flex-shrink-0 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Tambah Teks
                </button>
            </div>

            <!-- Panel Pengaturan Utama Running Text & Kecepatan -->
            <div class="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div class="flex items-center gap-4">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="global-status-toggle" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                    </label>
                    <div>
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 block">Aktif</span>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400">Tampilkan running text di beranda</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Kecepatan</span>
                    <select id="text-speed" class="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        <option value="slow">Lambat</option>
                        <option value="normal" selected>Normal</option>
                        <option value="fast">Cepat</option>
                    </select>
                </div>
            </div>

            <!-- Template Cepat -->
            <div class="space-y-2">
                <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Template Cepat — Klik untuk tambahkan</p>
                <div class="flex flex-wrap gap-2">
                    <button type="button" onclick="window.addTemplate('🛒 Selamat Datang')" class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium transition rounded-none flex items-center gap-1.5 shadow-xs cursor-pointer">
                        🛒 Selamat Datang
                    </button>
                    <button type="button" onclick="window.addTemplate('🎉 Promo Member')" class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium transition rounded-none flex items-center gap-1.5 shadow-xs cursor-pointer">
                        🎉 Promo Member
                    </button>
                    <button type="button" onclick="window.addTemplate('⚡ Diskon Hari Ini')" class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium transition rounded-none flex items-center gap-1.5 shadow-xs cursor-pointer">
                        ⚡ Diskon Hari Ini
                    </button>
                    <button type="button" onclick="window.addTemplate('⏰ Jam Operasional')" class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium transition rounded-none flex items-center gap-1.5 shadow-xs cursor-pointer">
                        ⏰ Jam Operasional
                    </button>
                    <button type="button" onclick="window.addTemplate('🌟 Promo Akhir Pekan')" class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium transition rounded-none flex items-center gap-1.5 shadow-xs cursor-pointer">
                        🌟 Promo Akhir Pekan
                    </button>
                </div>
            </div>

            <!-- Daftar Teks (Tabel untuk Desktop & Card untuk Mobile) -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div class="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
                    <h3 id="table-title" class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">DAFTAR TEKS (0)</h3>
                </div>
                
                <!-- Tampilan Tabel Desktop (hidden di HP) -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th class="p-3 w-16 text-center">No</th>
                                <th class="p-3">Teks Berjalan</th>
                                <th class="p-3 w-32 text-center">Status</th>
                                <th class="p-3 w-28 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="text-table-body" class="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                            <tr>
                                <td colspan="4" class="p-8 text-center text-slate-400">Memuat data running text...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Tampilan Card Grid Mobile (hidden di Desktop) -->
                <div id="text-card-container" class="block md:hidden p-3 space-y-3">
                    <div class="text-center text-slate-400 py-8 text-xs">Memuat data running text...</div>
                </div>
            </div>

            <!-- MODAL FORM TAMBAH / EDIT TEKS -->
            <div id="text-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl rounded-none overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
                        <h3 id="modal-title" class="font-bold text-slate-800 dark:text-slate-100 text-sm">Tambah Teks Baru</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-text" class="p-6 space-y-4">
                        <input type="hidden" id="text-id">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teks Berjalan</label>
                            <textarea id="text-content-input" rows="4" required class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Masukkan teks yang akan berjalan di beranda..."></textarea>
                        </div>
                        <div class="flex items-center gap-3 pt-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="text-status-input" checked class="sr-only peer">
                                <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                            </label>
                            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Aktif</span>
                        </div>
                        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition rounded-none cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" id="btn-save-text" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold transition rounded-none cursor-pointer shadow-md">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function initTextHandler() {
    const tableBody = document.getElementById('text-table-body');
    const cardContainer = document.getElementById('text-card-container');
    const tableTitle = document.getElementById('table-title');
    const modal = document.getElementById('text-modal');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-text');
    const modalTitle = document.getElementById('modal-title');

    const inputId = document.getElementById('text-id');
    const inputContent = document.getElementById('text-content-input');
    const inputStatus = document.getElementById('text-status-input');

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

    let allTexts = [];

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

    const renderTable = (data) => {
        if (!tableBody || !cardContainer) return;
        if (tableTitle) tableTitle.textContent = `DAFTAR TEKS (${data.length})`;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-400">Belum ada running text yang tersedia.</td></tr>`;
            cardContainer.innerHTML = `<div class="text-center text-slate-400 py-8 text-xs">Belum ada running text yang tersedia.</div>`;
            return;
        }

        let htmlTable = "";
        let htmlCards = "";

        data.forEach((item, index) => {
            const isActive = item.status !== false;
            const textStyle = isActive ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400 dark:text-slate-500 line-through';
            
            // Baris Tabel Desktop
            htmlTable += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800">
                    <td class="p-3 text-center font-semibold text-slate-500 dark:text-slate-400">${index + 1}</td>
                    <td class="p-3 ${textStyle}">${item.isi}</td>
                    <td class="p-3 text-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${isActive ? 'checked' : ''} onchange="window.toggleTextStatus('${item.id}', ${!isActive})" class="sr-only peer">
                            <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                        </label>
                    </td>
                    <td class="p-3 text-center">
                        <div class="flex items-center justify-center gap-1.5">
                            <button onclick="window.editText('${item.id}', '${encodeURIComponent(item.isi)}', ${isActive})" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition rounded-none cursor-pointer">Edit</button>
                            <button onclick="window.deleteText('${item.id}')" class="px-2.5 py-1 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 text-[11px] font-medium transition rounded-none cursor-pointer">Hapus</button>
                        </div>
                    </td>
                </tr>
            `;

            // Card Grid Mobile
            htmlCards += `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xs space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">#${index + 1}</span>
                    </div>
                    <div>
                        <p class="text-xs ${textStyle}">${item.isi}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">Status:</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" ${isActive ? 'checked' : ''} onchange="window.toggleTextStatus('${item.id}', ${!isActive})" class="sr-only peer">
                                <div class="w-8 h-4 bg-slate-200 dark:bg-slate-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                            </label>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button onclick="window.editText('${item.id}', '${encodeURIComponent(item.isi)}', ${isActive})" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition rounded-none cursor-pointer">Edit</button>
                            <button onclick="window.deleteText('${item.id}')" class="px-2.5 py-1 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 text-[11px] font-medium transition rounded-none cursor-pointer">Hapus</button>
                        </div>
                    </div>
                </div>
            `;
        });

        tableBody.innerHTML = htmlTable;
        cardContainer.innerHTML = htmlCards;
    };

    const loadTextData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "running_text"));
            allTexts = [];
            querySnapshot.forEach((docSnap) => {
                allTexts.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderTable(allTexts);
        } catch (err) {
            console.error("Gagal memuat data running text:", err);
            if (tableBody) tableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-red-500">Gagal memuat data dari database.</td></tr>`;
            if (cardContainer) cardContainer.innerHTML = `<div class="text-center text-red-500 py-8 text-xs">Gagal memuat data dari database.</div>`;
        }
    };

    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (form) form.reset();
            if (inputId) inputId.value = '';
            if (inputStatus) inputStatus.checked = true;
            if (modalTitle) modalTitle.textContent = "Tambah Teks Baru";
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
            const payload = {
                isi: inputContent.value,
                status: inputStatus.checked,
                updatedAt: new Date().toISOString()
            };

            try {
                if (id) {
                    await updateDoc(doc(db, "running_text", id), payload);
                    showToast("Running text berhasil diperbarui!", "success");
                } else {
                    payload.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "running_text"), payload);
                    showToast("Running text baru berhasil ditambahkan!", "success");
                }
                closeModal();
                loadTextData();
            } catch (err) {
                console.error("Gagal menyimpan running text:", err);
                showToast("Terjadi kesalahan saat menyimpan data.", "error");
            }
        };
    }

    // Global Window Handlers
    window.addTemplate = (templateText) => {
        if (form) form.reset();
        if (inputId) inputId.value = '';
        if (inputContent) inputContent.value = templateText + " — ";
        if (inputStatus) inputStatus.checked = true;
        if (modalTitle) modalTitle.textContent = "Tambah Teks Baru dari Template";
        if (modal) modal.classList.remove('hidden');
    };

    window.editText = (id, isi, status) => {
        if (inputId) inputId.value = id;
        if (inputContent) inputContent.value = decodeURIComponent(isi);
        if (inputStatus) inputStatus.checked = status;
        if (modalTitle) modalTitle.textContent = "Edit Running Text";
        if (modal) modal.classList.remove('hidden');
    };

    window.deleteText = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus teks ini?")) return;
        try {
            await deleteDoc(doc(db, "running_text", id));
            showToast("Running text berhasil dihapus.", "success");
            loadTextData();
        } catch (err) {
            console.error("Gagal menghapus running text:", err);
            showToast("Gagal menghapus teks.", "error");
        }
    };

    window.toggleTextStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "running_text", id), { status: newStatus });
            showToast("Status running text diperbarui.", "success");
            loadTextData();
        } catch (err) {
            console.error("Gagal mengubah status:", err);
            showToast("Gagal memperbarui status teks.", "error");
        }
    };

    loadTextData();
}