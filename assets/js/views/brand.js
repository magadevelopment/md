import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderBrandPublic() {
    return `
        <div class="space-y-6 max-w-6xl mx-auto relative pb-12">
            <!-- Header Title -->
            <div class="bg-white p-6 border border-slate-200">
                <h1 class="text-xl font-bold text-slate-800">Daftar Titik & Aset Branding</h1>
                <p class="text-xs text-slate-500 mt-0.5">Informasi ketersediaan titik promosi, harga sewa bulanan dan tahunan, serta status pemesanan di Swalayan Maga.</p>
            </div>

            <!-- Grid Card Branding Public (Read-Only) -->
            <div id="brand-public-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">
                    Memuat data aset branding...
                </div>
            </div>
        </div>
    `;
}

export async function initBrandPublicHandler() {
    const container = document.getElementById('brand-public-grid');
    if (!container) return;

    const formatRupiah = (number) => {
        if (!number && number !== 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    try {
        const querySnapshot = await getDocs(collection(db, "branding"));
        let brandList = [];
        querySnapshot.forEach((docSnap) => {
            brandList.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (brandList.length === 0) {
            container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">Belum ada data aset branding yang tersedia.</div>`;
            return;
        }

        let html = "";
        brandList.forEach((item) => {
            const imgUrl = item.gambar || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60";
            const statusPesan = item.statusPesan || "Belum Dipesan";
            const badgeClass = statusPesan === "Sudah Dipesan" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200";

            html += `
                <div class="bg-white border border-slate-200 shadow-xs rounded-none flex flex-col justify-between overflow-hidden">
                    <div>
                        <div class="h-44 w-full bg-slate-100 overflow-hidden relative">
                            <img src="${imgUrl}" alt="${item.nama}" class="w-full h-full object-cover">
                            <span class="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-semibold border ${badgeClass} rounded-none shadow-xs">
                                ${statusPesan}
                            </span>
                        </div>
                        <div class="p-4 space-y-3">
                            <h3 class="font-bold text-slate-800 text-sm">${item.nama}</h3>
                            <div class="space-y-1 bg-slate-50 p-2.5 border border-slate-100">
                                <div class="flex justify-between items-center text-xs">
                                    <span class="text-slate-500">Harga Bulanan:</span>
                                    <span class="font-semibold text-slate-800">${formatRupiah(item.hargaBulan)}</span>
                                </div>
                                <div class="flex justify-between items-center text-xs">
                                    <span class="text-slate-500">Harga Tahunan:</span>
                                    <span class="font-semibold text-slate-800">${formatRupiah(item.hargaTahun)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 pt-0">
                        <button onclick="alert('Silakan hubungi administrator Swalayan Maga untuk pemesanan titik branding ini.')" class="w-full py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold transition rounded-none text-center cursor-pointer">
                            ${statusPesan === 'Sudah Dipesan' ? 'Sudah Dipesan' : 'Pesan Titik Ini'}
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error("Gagal memuat data branding publik:", err);
        container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white border border-slate-200">Gagal memuat data aset branding.</div>`;
    }
}