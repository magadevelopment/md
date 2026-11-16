import { collection, getDocs, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderEvent() {
    return `
        <div class="space-y-4 sm:space-y-6 max-w-7xl mx-auto relative px-2 sm:px-0 pb-10">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Halaman & Tombol Tambah -->
            <div class="bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-xl font-bold text-slate-800">Event</h1>
                    <p class="text-xs text-slate-500 mt-0.5">Kelola informasi jadwal event, promo, dan kegiatan toko.</p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div class="relative flex-1 md:w-64">
                        <input type="text" id="search-event" placeholder="Cari event..." class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition pr-8">
                        <svg class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <button id="btn-open-modal" class="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 rounded-none text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                        Tambah Event
                    </button>
                </div>
            </div>

            <!-- Kontainer Data Event (Responsive: Card untuk Mobile, Tabel untuk Desktop) -->
            <div class="bg-white border border-slate-200 shadow-xs overflow-hidden">
                <!-- TAMPILAN DESKTOP (Tabel) -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                                <th class="p-3 border-r border-slate-200 w-10 text-center"><input type="checkbox" class="rounded-none"></th>
                                <th class="p-3 border-r border-slate-200 w-28 text-center">Foto Event (1:2)</th>
                                <th class="p-3 border-r border-slate-200 w-48">Judul Event</th>
                                <th class="p-3 border-r border-slate-200 w-36">Tanggal</th>
                                <th class="p-3 border-r border-slate-200">Deskripsi</th>
                                <th class="p-3 text-center w-20">Status</th>
                            </tr>
                        </thead>
                        <tbody id="table-event-body" class="divide-y divide-slate-100 text-slate-700">
                            <tr>
                                <td colspan="6" class="p-6 text-center text-slate-400">Memuat data event...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- TAMPILAN MOBILE (Card List) -->
                <div id="mobile-event-container" class="block md:hidden divide-y divide-slate-100">
                    <div class="p-6 text-center text-slate-400 text-xs">Memuat data event...</div>
                </div>

                <!-- Pagination Footer -->
                <div class="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                    <div>Menampilkan data event toko</div>
                    <div class="flex items-center gap-1">
                        <button class="px-3 py-1 border border-slate-200 bg-white hover:bg-slate-100 transition rounded-none">Previous</button>
                        <button class="px-3 py-1 border border-indigo-600 bg-indigo-600 text-white rounded-none font-semibold">1</button>
                        <button class="px-3 py-1 border border-slate-200 bg-white hover:bg-slate-100 transition rounded-none">Next</button>
                    </div>
                </div>
            </div>

            <!-- MODAL TAMBAH EVENT -->
            <div id="modal-event" class="hidden fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                <div class="bg-white border border-slate-200 max-w-3xl w-full shadow-2xl rounded-none relative overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 class="font-bold text-slate-800 text-sm">Tambah Event</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="form-tambah-event" class="p-6 space-y-4">
                        <input type="hidden" id="event-img-base64">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Event</label>
                                    <input type="text" id="event-title" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Misal: Event Heboh">
                                </div>

                                <!-- Pilihan Tipe Tanggal -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Tipe Durasi Tanggal</label>
                                    <select id="event-date-type" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition bg-white">
                                        <option value="single">1 Hari (Sehari)</option>
                                        <option value="period">Periode (Rentang Tanggal)</option>
                                    </select>
                                </div>

                                <!-- Kontainer Input Tanggal Dinamis -->
                                <div id="container-tanggal-tunggal">
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Event</label>
                                    <input type="date" id="event-date-single" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition">
                                </div>

                                <div id="container-tanggal-periode" class="hidden grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
                                        <input type="date" id="event-date-start" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai</label>
                                        <input type="date" id="event-date-end" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Event</label>
                                    <textarea id="event-desc" rows="3" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Masukkan deskripsi lengkap event..."></textarea>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Upload Gambar (Maks. 500px)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="file" id="event-file" accept="image/*" class="hidden">
                                        <input type="text" id="event-file-name" readonly placeholder="Tidak ada yang dipilih" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none bg-slate-50 text-slate-500">
                                        <button type="button" id="btn-browse-file" class="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 text-xs font-semibold rounded-none whitespace-nowrap cursor-pointer">Pilih File</button>
                                    </div>
                                    <p class="text-[10px] text-slate-400 mt-1">Otomatis dikompresi maksimal 500 piksel.</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Pratinjau Gambar (1:2)</label>
                                <div id="preview-container" class="h-[360px] w-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                    <span class="text-xs text-slate-400 text-center px-2">Pratinjau Gambar (1:2)</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" id="btn-save-event" class="bg-indigo-900 hover:bg-indigo-950 text-white px-6 py-2.5 text-xs font-semibold transition rounded-none cursor-pointer">
                                Simpan Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function initEventHandler() {
    const tableBody = document.getElementById('table-event-body');
    const mobileContainer = document.getElementById('mobile-event-container');
    const modal = document.getElementById('modal-event');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnBrowse = document.getElementById('btn-browse-file');
    const inputFile = document.getElementById('event-file');
    const inputFileName = document.getElementById('event-file-name');
    const inputBase64 = document.getElementById('event-img-base64');
    const previewContainer = document.getElementById('preview-container');
    const form = document.getElementById('form-tambah-event');
    const searchInput = document.getElementById('search-event');
    const selectDateType = document.getElementById('event-date-type');
    const containerSingle = document.getElementById('container-tanggal-tunggal');
    const containerPeriod = document.getElementById('container-tanggal-periode');
    const toast = document.getElementById('toast-notification');
    const toastContent = document.getElementById('toast-content');

    let eventsData = [];

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

    if (selectDateType) {
        selectDateType.onchange = (e) => {
            if (e.target.value === 'period') {
                containerSingle.classList.add('hidden');
                containerPeriod.classList.remove('hidden');
            } else {
                containerSingle.classList.remove('hidden');
                containerPeriod.classList.add('hidden');
            }
        };
    }

    if (btnOpenModal && modal) {
        btnOpenModal.onclick = () => modal.classList.remove('hidden');
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
                    previewContainer.innerHTML = `<img src="${compressedBase64}" alt="Preview" class="w-full h-full object-contain">`;
                } catch (err) {
                    console.error("Gagal kompres gambar:", err);
                    showToast("Gagal memproses gambar.", "error");
                }
            }
        };
    }

    const loadEvents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "event"));
            eventsData = [];
            querySnapshot.forEach((docSnap) => {
                eventsData.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderDataViews(eventsData);
        } catch (err) {
            console.error("Gagal memuat event:", err);
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Gagal memuat data event.</td></tr>`;
            }
            if (mobileContainer) {
                mobileContainer.innerHTML = `<div class="p-6 text-center text-red-500 text-xs">Gagal memuat data event.</div>`;
            }
        }
    };

    const renderDataViews = (data) => {
        if (!tableBody || !mobileContainer) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Belum ada data event.</td></tr>`;
            mobileContainer.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">Belum ada data event.</div>`;
            return;
        }

        let tableHtml = '';
        let mobileHtml = '';

        data.forEach((item) => {
            const isActive = item.status !== false;
            
            let tanggalStr = '-';
            if (item.tipeTanggal === 'period') {
                tanggalStr = `${item.tanggalMulai || ''} s/d ${item.tanggalSelesai || ''}`;
            } else {
                tanggalStr = item.tanggalSingle || item.createdAt?.substring(0, 10) || '-';
            }

            // HTML untuk Tabel (Desktop)
            tableHtml += `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-3 border-r border-slate-100 text-center"><input type="checkbox" class="rounded-none"></td>
                    <td class="p-3 border-r border-slate-100">
                        <div class="h-20 w-10 bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mx-auto">
                            ${item.gambar ? `<img src="${item.gambar}" alt="Event" class="w-full h-full object-cover">` : `<span class="text-[9px] text-slate-400">No Image</span>`}
                        </div>
                    </td>
                    <td class="p-3 border-r border-slate-100 font-semibold text-slate-900">${item.judul || '-'}</td>
                    <td class="p-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">${tanggalStr}</td>
                    <td class="p-3 border-r border-slate-100 text-slate-600 truncate max-w-xs">${item.deskripsi || '-'}</td>
                    <td class="p-3 text-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer toggle-status" data-id="${item.id}" ${isActive ? 'checked' : ''}>
                            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-900"></div>
                        </label>
                    </td>
                </tr>
            `;

            // HTML untuk Card (Mobile)
            mobileHtml += `
                <div class="p-4 flex gap-3 items-start bg-white">
                    <div class="h-24 w-12 bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        ${item.gambar ? `<img src="${item.gambar}" alt="Event" class="w-full h-full object-cover">` : `<span class="text-[8px] text-slate-400">No Img</span>`}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start gap-2 mb-1">
                            <h3 class="font-bold text-slate-900 text-xs truncate">${item.judul || '-'}</h3>
                            <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                <input type="checkbox" class="sr-only peer toggle-status" data-id="${item.id}" ${isActive ? 'checked' : ''}>
                                <div class="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-900"></div>
                            </label>
                        </div>
                        <p class="text-[11px] text-indigo-600 font-medium mb-1">${tanggalStr}</p>
                        <p class="text-xs text-slate-600 line-clamp-2">${item.deskripsi || '-'}</p>
                    </div>
                </div>
            `;
        });

        tableBody.innerHTML = tableHtml;
        mobileContainer.innerHTML = mobileHtml;

        // Binding event toggle status untuk kedua tampilan
        document.querySelectorAll('.toggle-status').forEach((chk) => {
            chk.onchange = async (e) => {
                const id = e.target.getAttribute('data-id');
                const newStatus = e.target.checked;
                try {
                    await updateDoc(doc(db, "event", id), { status: newStatus });
                    showToast("Status event berhasil diperbarui.", "success");
                } catch (err) {
                    console.error("Gagal update status:", err);
                    showToast("Gagal memperbarui status.", "error");
                    e.target.checked = !newStatus;
                }
            };
        });
    };

    loadEvents();

    if (searchInput) {
        searchInput.oninput = (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = eventsData.filter(item => 
                (item.judul && item.judul.toLowerCase().includes(keyword)) ||
                (item.deskripsi && item.deskripsi.toLowerCase().includes(keyword))
            );
            renderDataViews(filtered);
        };
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const title = document.getElementById('event-title').value;
            const desc = document.getElementById('event-desc').value;
            const dateType = selectDateType.value;
            const singleDate = document.getElementById('event-date-single').value;
            const startDate = document.getElementById('event-date-start').value;
            const endDate = document.getElementById('event-date-end').value;
            const base64Img = inputBase64.value;
            const btnSave = document.getElementById('btn-save-event');

            if (dateType === 'single' && !singleDate) {
                showToast("Silakan masukkan tanggal event.", "error");
                return;
            }
            if (dateType === 'period' && (!startDate || !endDate)) {
                showToast("Silakan masukkan tanggal mulai dan selesai.", "error");
                return;
            }

            if (btnSave) {
                btnSave.disabled = true;
                btnSave.textContent = "Menyimpan...";
            }

            try {
                const payload = {
                    judul: title,
                    deskripsi: desc,
                    tipeTanggal: dateType,
                    tanggalSingle: dateType === 'single' ? singleDate : '',
                    tanggalMulai: dateType === 'period' ? startDate : '',
                    tanggalSelesai: dateType === 'period' ? endDate : '',
                    gambar: base64Img || '',
                    status: true,
                    createdAt: new Date().toISOString()
                };

                await addDoc(collection(db, "event"), payload);
                showToast("Event berhasil ditambahkan!", "success");
                modal.classList.add('hidden');
                form.reset();
                containerSingle.classList.remove('hidden');
                containerPeriod.classList.add('hidden');
                inputFileName.value = "Tidak ada yang dipilih";
                inputBase64.value = "";
                previewContainer.innerHTML = `<span class="text-xs text-slate-400 text-center px-2">Pratinjau Gambar (1:2)</span>`;
                loadEvents();
            } catch (err) {
                console.error("Gagal menyimpan event:", err);
                showToast("Terjadi kesalahan saat menyimpan event.", "error");
            } finally {
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.textContent = "Simpan Event";
                }
            }
        };
    }
}