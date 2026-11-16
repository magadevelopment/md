import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderPendaftaranAdmin() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto relative pb-12">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Halaman -->
            <div class="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex items-center gap-3">
                    <a href="#/manajemen" data-link class="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 rounded-none">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Kembali
                    </a>
                    <div>
                        <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <span class="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-none border border-indigo-100 dark:border-indigo-900">📋</span> Rekapitulasi Pendaftaran Distributor (Admin)
                        </h1>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daftar seluruh pendaftaran distributor dari semua staf atau pengguna.</p>
                    </div>
                </div>
                <button id="btn-export-excel" class="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2.5 rounded-none text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Excel (CSV)
                </button>
            </div>

            <!-- Kontainer Utama Data (Card untuk Mobile & Tabel untuk Desktop) -->
            <div id="admin-pendaftaran-container">
                <div class="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">Memuat data pendaftaran...</div>
            </div>

            <!-- MODAL KONFIRMASI HAPUS KUSTOM (SMOOTH) -->
            <div id="delete-confirm-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 flex items-center justify-center p-4 transition-all duration-300">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm shadow-2xl rounded-none p-6 text-center space-y-4">
                    <div class="w-12 h-12 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto rounded-none border border-red-100 dark:border-red-900">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">Konfirmasi Hapus</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Apakah Anda yakin ingin menghapus data pendaftaran distributor ini?</p>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button id="btn-cancel-delete" class="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition rounded-none">Batal</button>
                        <button id="btn-confirm-delete" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-semibold transition rounded-none cursor-pointer shadow-md">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initPendaftaranAdminHandler() {
    const container = document.getElementById('admin-pendaftaran-container');
    const btnExport = document.getElementById('btn-export-excel');
    if (!container) return;

    let allData = [];

    // Elemen Modal Hapus Kustom
    const deleteModal = document.getElementById('delete-confirm-modal');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    let currentDeleteId = null;

    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

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

    const loadAllData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "pendaftaran_distributor"));
            allData = [];
            let index = 1;

            let cardHtml = `<div class="space-y-3 md:hidden">`; // Tampilan Card Khusus HP
            let tableRowsHtml = ``; // Tampilan Tabel Khusus Desktop

            querySnapshot.forEach((docSnap) => {
                const item = docSnap.data();
                const id = docSnap.id;

                if (!item.nama || item.nama.trim() === "") return;

                allData.push({ id, ...item });

                let formattedDate = '-';
                if (item.createdAt) {
                    formattedDate = item.createdAt.substring(0, 10);
                }

                // --- 1. RENDER TAMPILAN CARD (KHUSUS HP / MOBILE) ---
                cardHtml += `
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-none shadow-xs space-y-3">
                        <div class="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                            <div>
                                <span class="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-none border border-indigo-100 dark:border-indigo-900">#${index}</span>
                                <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">${item.nama || '-'}</h3>
                            </div>
                            <button onclick="window.deleteAdminPendaftaran('${id}')" class="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-none transition" title="Hapus Data">
                                🗑️
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span class="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Tanggal</span>
                                <span class="font-medium text-slate-700 dark:text-slate-300">${formattedDate}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Penanggungjawab</span>
                                <span class="font-medium text-slate-700 dark:text-slate-300">${item.penanggungjawab || '-'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Kontak Kantor</span>
                                <a href="https://wa.me/${item.kontak_kantor || ''}" target="_blank" class="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                    ${item.kontak_kantor || '-'}
                                </a>
                            </div>
                            <div>
                                <span class="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Sales</span>
                                <span class="text-slate-700 dark:text-slate-300">${item.sales_nama || '-'} (${item.sales_hp || '-'})</span>
                            </div>
                            <div>
                                <span class="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Supervisor</span>
                                <span class="text-slate-700 dark:text-slate-300">${item.spv_nama || '-'} (${item.spv_hp || '-'})</span>
                            </div>
                        </div>
                        <div class="border-t border-slate-100 dark:border-slate-800 pt-2 text-xs space-y-1">
                            <div><span class="text-slate-400 dark:text-slate-500 text-[10px] uppercase block">Produk</span> <span class="text-slate-600 dark:text-slate-300 whitespace-pre-line">${item.produk || '-'}</span></div>
                            <div class="flex justify-between items-center pt-1">
                                <span class="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Termin</span>
                                <span class="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-none border border-indigo-100 dark:border-indigo-900">${item.termin || '-'}</span>
                            </div>
                        </div>
                    </div>
                `;

                // --- 2. RENDER TAMPILAN TABEL (KHUSUS DESKTOP) ---
                tableRowsHtml += `
                    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800">
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 font-bold text-indigo-600 dark:text-indigo-400">#${index}</td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">${formattedDate}</td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100">${item.nama || '-'}</td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">${item.penanggungjawab || '-'}</td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800">
                            <a href="https://wa.me/${item.kontak_kantor || ''}" target="_blank" class="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                ${item.kontak_kantor || '-'}
                            </a>
                        </td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 space-y-0.5 text-slate-700 dark:text-slate-300">
                            <div><span class="text-slate-400 dark:text-slate-500">Sales:</span> ${item.sales_nama || '-'} (${item.sales_hp || '-'})</div>
                            <div><span class="text-slate-400 dark:text-slate-500">SPV:</span> ${item.spv_nama || '-'} (${item.spv_hp || '-'})</div>
                        </td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 whitespace-pre-line text-slate-600 dark:text-slate-400">${item.produk || '-'}</td>
                        <td class="p-3 border-r border-slate-100 dark:border-slate-800 font-medium text-indigo-600 dark:text-indigo-400">${item.termin || '-'}</td>
                        <td class="p-3 text-center">
                            <button onclick="window.deleteAdminPendaftaran('${id}')" class="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Hapus Data">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `;
                index++;
            });

            cardHtml += `</div>`;

            const desktopTableHtml = `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden hidden md:block">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px]">
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">#</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Tanggal</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Distributor</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Penanggungjawab</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Kontak Kantor</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Sales & Supervisor</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Produk</th>
                                    <th class="p-3 border-r border-slate-200 dark:border-slate-800">Termin</th>
                                    <th class="p-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            if (allData.length === 0) {
                container.innerHTML = `<div class="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">Belum ada data pendaftaran distributor.</div>`;
            } else {
                container.innerHTML = cardHtml + desktopTableHtml;
            }
        } catch (err) {
            console.error("Gagal memuat rekap pendaftaran:", err);
            container.innerHTML = `<div class="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 text-center text-red-500 dark:text-red-400 text-xs">Gagal memuat data dari database.</div>`;
        }
    };

    loadAllData();

    // Fungsi Export ke Excel (CSV)
    if (btnExport) {
        btnExport.onclick = () => {
            if (allData.length === 0) {
                showToast("Tidak ada data untuk diexport.", "error");
                return;
            }

            let csvContent = "\uFEFF"; 
            csvContent += "No,Tanggal Dibuat,Nama Distributor,Penanggungjawab,Kontak Kantor,Nama Sales,HP Sales,Nama Supervisor,HP Supervisor,Produk,Termin Pembayaran\n";

            allData.forEach((item, idx) => {
                const row = [
                    idx + 1,
                    `"${(item.createdAt || '').substring(0, 10)}"`,
                    `"${(item.nama || '').replace(/"/g, '""')}"`,
                    `"${(item.penanggungjawab || '').replace(/"/g, '""')}"`,
                    `"${(item.kontak_kantor || '').replace(/"/g, '""')}"`,
                    `"${(item.sales_nama || '').replace(/"/g, '""')}"`,
                    `"${(item.sales_hp || '').replace(/"/g, '""')}"`,
                    `"${(item.spv_nama || '').replace(/"/g, '""')}"`,
                    `"${(item.spv_hp || '').replace(/"/g, '""')}"`,
                    `"${(item.produk || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
                    `"${(item.termin || '').replace(/"/g, '""')}"`
                ];
                csvContent += row.join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Rekap_Pendaftaran_Distributor_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast("File Excel (CSV) berhasil diunduh!", "success");
        };
    }

    // Global helper untuk Hapus Data oleh Admin dengan Modal Konfirmasi Kustom
    window.deleteAdminPendaftaran = (id) => {
        currentDeleteId = id;
        if (deleteModal) deleteModal.classList.remove('hidden');
    };

    if (btnCancelDelete) {
        btnCancelDelete.onclick = () => {
            currentDeleteId = null;
            if (deleteModal) deleteModal.classList.add('hidden');
        };
    }

    if (btnConfirmDelete) {
        btnConfirmDelete.onclick = async () => {
            if (!currentDeleteId) return;
            try {
                await deleteDoc(doc(db, "pendaftaran_distributor", currentDeleteId));
                showToast("Data pendaftaran distributor berhasil dihapus.", "success");
                if (deleteModal) deleteModal.classList.add('hidden');
                currentDeleteId = null;
                loadAllData();
            } catch (err) {
                console.error("Gagal menghapus data:", err);
                showToast("Gagal menghapus data.", "error");
                if (deleteModal) deleteModal.classList.add('hidden');
            }
        };
    }
}