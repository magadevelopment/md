import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderTokoPublic() {
    return `
        <div class="space-y-6 max-w-5xl mx-auto relative pb-12">
            <!-- Header Title -->
            <div class="bg-white p-6 border border-slate-200">
                <h1 class="text-xl font-bold text-slate-800">Daftar Cabang Swalayan Maga</h1>
                <p class="text-xs text-slate-500 mt-0.5">Temukan lokasi cabang terdekat Swalayan Maga lengkap dengan alamat, kontak, dan petunjuk arah Google Maps.</p>
            </div>

            <!-- List / Grid Card Cabang Toko (Read-Only) -->
            <div id="toko-public-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">
                    Memuat data cabang toko...
                </div>
            </div>
        </div>
    `;
}

export async function initTokoPublicHandler() {
    const container = document.getElementById('toko-public-grid');
    if (!container) return;

    try {
        const querySnapshot = await getDocs(collection(db, "toko_cabang"));
        let tokoList = [];
        querySnapshot.forEach((docSnap) => {
            tokoList.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (tokoList.length === 0) {
            container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">Belum ada data cabang toko yang tersedia.</div>`;
            return;
        }

        let html = "";
        tokoList.forEach((toko) => {
            const imgPlaceholder = toko.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
            html += `
                <div class="bg-white border border-slate-200 shadow-xs rounded-none flex flex-col justify-between overflow-hidden">
                    <div>
                        <div class="h-48 w-full bg-slate-100 overflow-hidden relative">
                            <img src="${imgPlaceholder}" alt="${toko.nama}" class="w-full h-full object-cover">
                            <span class="absolute top-2 right-2 bg-indigo-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-none">${toko.kode || 'CABANG'}</span>
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
                    <div class="p-4 pt-3 flex items-center justify-between border-t border-slate-100 bg-slate-50 mt-4">
                        <span class="text-[11px] text-slate-500 font-medium">Swalayan Maga Cabang Resmi</span>
                        ${toko.maps ? `<a href="${toko.maps}" target="_blank" class="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition flex items-center gap-1.5 rounded-none"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Buka Maps</a>` : '<span class="text-[11px] text-slate-400">Maps belum tersedia</span>'}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error("Gagal memuat data toko publik:", err);
        container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white border border-slate-200">Gagal memuat data cabang toko.</div>`;
    }
}