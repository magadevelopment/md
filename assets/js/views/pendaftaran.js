import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderPendaftaranAdmin() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto">
            <!-- Header Halaman -->
            <div class="bg-white p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="p-2 bg-indigo-50 text-indigo-600 rounded-none">📋</span> Rekapitulasi Pendaftaran Distributor (Admin)
                    </h1>
                    <p class="text-xs text-slate-500 mt-0.5">Daftar seluruh pendaftaran distributor dari semua staf atau pengguna.</p>
                </div>
                <button id="btn-export-excel" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-none text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Excel (CSV)
                </button>
            </div>

            <!-- Kontainer Utama Data (Card untuk Mobile & Tabel untuk Desktop) -->
            <div id="admin-pendaftaran-container">
                <div class="bg-white p-8 border border-slate-200 text-center text-slate-400 text-xs">Memuat data pendaftaran...</div>
            </div>
        </div>
    `;
}

export function initPendaftaranAdminHandler() {
    const container = document.getElementById('admin-pendaftaran-container');
    const btnExport = document.getElementById('btn-export-excel');
    if (!container) return;

    let allData = [];

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

                // --- 1. RENDER TAMPILAN CARD (KHUSUS HP / MOBILE) ---
                cardHtml += `
                    <div class="bg-white border border-slate-200 p-4 rounded-none shadow-xs space-y-3">
                        <div class="flex justify-between items-start border-b border-slate-100 pb-2">
                            <div>
                                <span class="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-none">#${index}</span>
                                <h3 class="font-bold text-slate-900 text-sm mt-1">${item.nama || '-'}</h3>
                            </div>
                            <button onclick="window.deleteAdminPendaftaran('${id}')" class="text-slate-400 hover:text-red-600 p-1 rounded-none transition" title="Hapus Data">
                                🗑️
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase">Penanggungjawab</span>
                                <span class="font-medium text-slate-700">${item.penanggungjawab || '-'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase">Kontak Kantor</span>
                                <a href="https://wa.me/${item.kontak_kantor || ''}" target="_blank" class="text-emerald-600 font-semibold hover:underline">
                                    ${item.kontak_kantor || '-'}
                                </a>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase">Sales</span>
                                <span class="text-slate-700">${item.sales_nama || '-'} (${item.sales_hp || '-'})</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase">Supervisor</span>
                                <span class="text-slate-700">${item.spv_nama || '-'} (${item.spv_hp || '-'})</span>
                            </div>
                        </div>
                        <div class="border-t border-slate-100 pt-2 text-xs space-y-1">
                            <div><span class="text-slate-400 text-[10px] uppercase block">Produk</span> <span class="text-slate-600 whitespace-pre-line">${item.produk || '-'}</span></div>
                            <div class="flex justify-between items-center pt-1">
                                <span class="text-slate-400 text-[10px] uppercase">Termin</span>
                                <span class="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-none">${item.termin || '-'}</span>
                            </div>
                        </div>
                    </div>
                `;

                // --- 2. RENDER TAMPILAN TABEL (KHUSUS DESKTOP) ---
                tableRowsHtml += `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="p-3 border-r border-slate-100 font-bold text-indigo-600">#${index}</td>
                        <td class="p-3 border-r border-slate-100 font-semibold text-slate-900">${item.nama || '-'}</td>
                        <td class="p-3 border-r border-slate-100">${item.penanggungjawab || '-'}</td>
                        <td class="p-3 border-r border-slate-100">
                            <a href="https://wa.me/${item.kontak_kantor || ''}" target="_blank" class="text-emerald-600 font-semibold hover:underline">
                                ${item.kontak_kantor || '-'}
                            </a>
                        </td>
                        <td class="p-3 border-r border-slate-100 space-y-0.5">
                            <div><span class="text-slate-400">Sales:</span> ${item.sales_nama || '-'} (${item.sales_hp || '-'})</div>
                            <div><span class="text-slate-400">SPV:</span> ${item.spv_nama || '-'} (${item.spv_hp || '-'})</div>
                        </td>
                        <td class="p-3 border-r border-slate-100 whitespace-pre-line text-slate-600">${item.produk || '-'}</td>
                        <td class="p-3 border-r border-slate-100 font-medium text-indigo-600">${item.termin || '-'}</td>
                        <td class="p-3 text-center">
                            <button onclick="window.deleteAdminPendaftaran('${id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-none hover:bg-slate-100 transition" title="Hapus Data">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `;
                index++;
            });

            cardHtml += `</div>`;

            const desktopTableHtml = `
                <div class="bg-white border border-slate-200 shadow-xs overflow-hidden hidden md:block">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                                    <th class="p-3 border-r border-slate-200">#</th>
                                    <th class="p-3 border-r border-slate-200">Distributor</th>
                                    <th class="p-3 border-r border-slate-200">Penanggungjawab</th>
                                    <th class="p-3 border-r border-slate-200">Kontak Kantor</th>
                                    <th class="p-3 border-r border-slate-200">Sales & Supervisor</th>
                                    <th class="p-3 border-r border-slate-200">Produk</th>
                                    <th class="p-3 border-r border-slate-200">Termin</th>
                                    <th class="p-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-slate-700">
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            if (allData.length === 0) {
                container.innerHTML = `<div class="bg-white p-8 border border-slate-200 text-center text-slate-400 text-xs">Belum ada data pendaftaran distributor.</div>`;
            } else {
                container.innerHTML = cardHtml + desktopTableHtml;
            }
        } catch (err) {
            console.error("Gagal memuat rekap pendaftaran:", err);
            container.innerHTML = `<div class="bg-white p-8 border border-slate-200 text-center text-red-500 text-xs">Gagal memuat data dari database.</div>`;
        }
    };

    loadAllData();

    // Fungsi Export ke Excel (CSV)
    if (btnExport) {
        btnExport.onclick = () => {
            if (allData.length === 0) {
                alert("Tidak ada data untuk diexport.");
                return;
            }

            let csvContent = "\uFEFF"; 
            csvContent += "No,Nama Distributor,Penanggungjawab,Kontak Kantor,Nama Sales,HP Sales,Nama Supervisor,HP Supervisor,Produk,Termin Pembayaran,Tanggal Dibuat\n";

            allData.forEach((item, idx) => {
                const row = [
                    idx + 1,
                    `"${(item.nama || '').replace(/"/g, '""')}"`,
                    `"${(item.penanggungjawab || '').replace(/"/g, '""')}"`,
                    `"${(item.kontak_kantor || '').replace(/"/g, '""')}"`,
                    `"${(item.sales_nama || '').replace(/"/g, '""')}"`,
                    `"${(item.sales_hp || '').replace(/"/g, '""')}"`,
                    `"${(item.spv_nama || '').replace(/"/g, '""')}"`,
                    `"${(item.spv_hp || '').replace(/"/g, '""')}"`,
                    `"${(item.produk || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
                    `"${(item.termin || '').replace(/"/g, '""')}"`,
                    `"${(item.createdAt || '').replace(/"/g, '""')}"`
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
        };
    }

    // Global helper untuk Hapus Data oleh Admin
    window.deleteAdminPendaftaran = async (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data pendaftaran distributor ini?")) {
            try {
                await deleteDoc(doc(db, "pendaftaran_distributor", id));
                loadAllData();
            } catch (err) {
                console.error("Gagal menghapus data:", err);
                alert("Gagal menghapus data.");
            }
        }
    };
}