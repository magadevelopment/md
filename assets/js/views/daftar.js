import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "../firebase-init.js";

export function renderDaftar() {
    return `
        <div class="space-y-6 max-w-5xl mx-auto">
            <!-- Header Halaman -->
            <div class="bg-white p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="p-2 bg-indigo-50 text-indigo-600 rounded-none">📋</span> Daftar Pendaftaran Distributor Saya
                    </h1>
                    <p class="text-xs text-slate-500 mt-0.5">Kelola dan tambah data pendaftaran distributor Anda.</p>
                </div>
                <button id="btn-open-modal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-none text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Tambah Pendaftaran Baru
                </button>
            </div>

            <!-- List Card Distributor -->
            <div id="daftar-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">
                    Memuat data pendaftaran...
                </div>
            </div>

            <!-- Modal Form Pendaftaran -->
            <div id="modal-pendaftaran" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-white max-w-lg w-full p-6 shadow-2xl relative my-8 border border-slate-200">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 id="modal-title" class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-none">📄</span> Formulir Pendaftaran Distributor Baru
                        </h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1 rounded-none hover:bg-slate-100">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <form id="form-pendaftaran" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        <input type="hidden" id="distributor-id">
                        
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Distributor</label>
                            <input type="text" id="nama" required class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Masukkan nama distributor">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Penanggungjawab</label>
                            <input type="text" id="penanggungjawab" required class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nama penanggungjawab">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Nomor HP Kantor / Admin</label>
                            <input type="text" id="kontak_kantor" required class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 081234567890">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Sales</label>
                                <input type="text" id="sales_nama" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Masukkan nama sales">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">No HP Sales</label>
                                <input type="text" id="sales_hp" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 081234567891">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Supervisor</label>
                                <input type="text" id="spv_nama" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Masukkan nama supervisor">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">No HP Supervisor</label>
                                <input type="text" id="spv_hp" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 081234567892">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Produk yang Dibawa</label>
                            <textarea id="produk" rows="3" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Daftar produk yang dibawa"></textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Jatuh Tempo (Termin Pembayaran)</label>
                            <select id="termin" class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                <option value="">-- Pilih Jangka Waktu Jatuh Tempo --</option>
                                <option value="7 Hari">7 Hari</option>
                                <option value="14 Hari">14 Hari</option>
                                <option value="30 Hari">30 Hari</option>
                                <option value="45 Hari">45 Hari</option>
                                <option value="60 Hari">60 Hari</option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <button type="button" id="btn-cancel" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-none transition cursor-pointer">Batal</button>
                            <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-none transition shadow-md cursor-pointer flex items-center gap-1.5">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                Simpan & Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function initDaftarHandler() {
    const container = document.getElementById('daftar-container');
    const modal = document.getElementById('modal-pendaftaran');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const form = document.getElementById('form-pendaftaran');
    const modalTitle = document.getElementById('modal-title');

    if (!container) return;

    const toggleModal = (show = true) => {
        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
            form.reset();
            document.getElementById('distributor-id').value = '';
            modalTitle.innerHTML = `<span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-none">📄</span> Formulir Pendaftaran Distributor Baru`;
        }
    };

    if (btnOpen) btnOpen.onclick = () => toggleModal(true);
    if (btnClose) btnClose.onclick = () => toggleModal(false);
    if (btnCancel) btnCancel.onclick = () => toggleModal(false);

    // Fungsi Load Data difilter berdasarkan UID User yang sedang login
    const loadData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">Silakan login terlebih dahulu.</div>`;
                return;
            }

            // Query Firestore hanya mengambil data milik user yang sedang aktif (uid sama)
            const q = query(collection(db, "pendaftaran_distributor"), where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            let listHtml = "";
            let index = 1;

            querySnapshot.forEach((docSnap) => {
                const item = docSnap.data();
                const id = docSnap.id;

                if (!item.nama || item.nama.trim() === "") return;

                listHtml += `
                    <div class="bg-white p-5 border border-slate-200 shadow-xs space-y-4 relative">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-none text-[10px] font-bold">#${index}</span>
                                <h3 class="text-sm font-bold text-slate-800">${item.nama}</h3>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="window.editDaftar('${id}')" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-none hover:bg-slate-50 transition" title="Edit">✏️</button>
                                <button onclick="window.deleteDaftar('${id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-none hover:bg-slate-50 transition" title="Hapus">🗑️</button>
                            </div>
                        </div>

                        <p class="text-xs text-slate-500">PJ: <span class="font-medium text-slate-700">${item.penanggungjawab || '-'}</span></p>

                        <div class="grid grid-cols-2 gap-3 pt-1">
                            <div class="bg-slate-50 p-3 rounded-none border border-slate-100">
                                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Kontak Kantor</span>
                                <span class="text-xs font-semibold text-slate-700">${item.kontak_kantor || '-'}</span>
                            </div>
                            <div class="bg-slate-50 p-3 rounded-none border border-slate-100">
                                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Termin Pembayaran</span>
                                <span class="text-xs font-semibold text-indigo-600">${item.termin || '-'}</span>
                            </div>
                        </div>

                        <div class="text-xs space-y-1 bg-indigo-50/40 p-3 rounded-none border border-indigo-50">
                            <div class="flex justify-between"><span class="text-slate-500">Sales:</span> <span class="font-semibold text-slate-700">${item.sales_nama || '-'} (${item.sales_hp || '-'})</span></div>
                            <div class="flex justify-between"><span class="text-slate-500">Supervisor:</span> <span class="font-semibold text-slate-700">${item.spv_nama || '-'} (${item.spv_hp || '-'})</span></div>
                        </div>

                        <div>
                            <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Produk:</span>
                            <div class="bg-slate-50 p-3 rounded-none border border-slate-100 text-xs text-slate-700 whitespace-pre-line">
                                ${item.produk || '-'}
                            </div>
                        </div>
                    </div>
                `;
                index++;
            });

            if (listHtml === "") {
                container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-white border border-slate-200">Belum ada data pendaftaran distributor Anda.</div>`;
            } else {
                container.innerHTML = listHtml;
            }
        } catch (err) {
            console.error("Gagal memuat data pendaftaran:", err);
            container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white border border-slate-200">Gagal memuat data dari database.</div>`;
        }
    };

    loadData();

    // Submit Form (Simpan / Update) dengan menyertakan UID
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Sesi login berakhir. Silakan login kembali.");
                return;
            }

            const id = document.getElementById('distributor-id').value;
            const data = {
                uid: currentUser.uid, // Menyimpan UID pembuat data
                nama: document.getElementById('nama').value,
                penanggungjawab: document.getElementById('penanggungjawab').value,
                kontak_kantor: document.getElementById('kontak_kantor').value,
                sales_nama: document.getElementById('sales_nama').value,
                sales_hp: document.getElementById('sales_hp').value,
                spv_nama: document.getElementById('spv_nama').value,
                spv_hp: document.getElementById('spv_hp').value,
                produk: document.getElementById('produk').value,
                termin: document.getElementById('termin').value,
                updatedAt: new Date().toISOString()
            };

            try {
                if (id) {
                    await updateDoc(doc(db, "pendaftaran_distributor", id), data);
                } else {
                    data.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "pendaftaran_distributor"), data);
                }
                toggleModal(false);
                loadData();
            } catch (err) {
                console.error("Gagal menyimpan data:", err);
                alert("Terjadi kesalahan saat menyimpan data.");
            }
        };
    }

    // Global helper untuk Edit & Hapus
    window.editDaftar = async (id) => {
        try {
            const querySnapshot = await getDocs(collection(db, "pendaftaran_distributor"));
            let targetData = null;
            querySnapshot.forEach(d => {
                if (d.id === id) targetData = d.data();
            });

            if (targetData) {
                document.getElementById('distributor-id').value = id;
                document.getElementById('nama').value = targetData.nama || '';
                document.getElementById('penanggungjawab').value = targetData.penanggungjawab || '';
                document.getElementById('kontak_kantor').value = targetData.kontak_kantor || '';
                document.getElementById('sales_nama').value = targetData.sales_nama || '';
                document.getElementById('sales_hp').value = targetData.sales_hp || '';
                document.getElementById('spv_nama').value = targetData.spv_nama || '';
                document.getElementById('spv_hp').value = targetData.spv_hp || '';
                document.getElementById('produk').value = targetData.produk || '';
                document.getElementById('termin').value = targetData.termin || '';

                modalTitle.innerHTML = `<span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-none">✏️</span> Edit Pendaftaran Distributor`;
                toggleModal(true);
            }
        } catch (err) {
            console.error("Gagal mengambil data untuk diedit:", err);
        }
    };

    window.deleteDaftar = async (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data pendaftaran distributor ini?")) {
            try {
                await deleteDoc(doc(db, "pendaftaran_distributor", id));
                loadData();
            } catch (err) {
                console.error("Gagal menghapus data:", err);
                alert("Gagal menghapus data.");
            }
        }
    };
}