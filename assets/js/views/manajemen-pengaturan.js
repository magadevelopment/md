import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export function renderPengaturan() {
    return `
        <div class="space-y-4 sm:space-y-6 max-w-4xl mx-auto relative px-2 sm:px-0 pb-10">
            <!-- Toast Notification Container -->
            <div id="toast-notification" class="hidden fixed top-5 right-5 z-50 transition-all duration-300 transform translate-y-[-1rem] opacity-0 max-w-xs w-full px-4">
                <div id="toast-content" class="px-4 py-3 shadow-lg border text-xs font-medium flex items-center gap-2 rounded-none">
                    <!-- Icon & Text injected dynamically -->
                </div>
            </div>

            <!-- Header Halaman & Tombol Kembali -->
            <div class="bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-lg sm:text-xl font-bold text-slate-800">Pengaturan Perusahaan</h1>
                    <p class="text-xs text-slate-500 mt-0.5">Kelola identitas operasional serta narasi Company Profile Swalayan Maga.</p>
                </div>
                <a href="#/manajemen" data-link class="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition rounded-none">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span>Kembali</span>
                </a>
            </div>

            <!-- Tab Navigation -->
            <div class="flex border-b border-slate-200 bg-white">
                <button type="button" id="tab-btn-profil" class="px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 text-indigo-600 transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    Profil Perusahaan
                </button>
                <button type="button" id="tab-btn-narasi" class="px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Company Profile (Narasi)
                </button>
            </div>

            <!-- Tab Content 1: Profil Perusahaan -->
            <div id="tab-content-profil" class="bg-white border border-slate-200 p-4 sm:p-6 shadow-xs rounded-none">
                <form id="form-pengaturan-perusahaan" class="space-y-4">
                    <input type="hidden" id="comp-logo-base64">
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Perusahaan / Toko</label>
                            <input type="text" id="comp-name" required class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Contoh: PT Swalayan Maga Utama">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                            <input type="text" id="comp-phone" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Contoh: 081234567890">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
                            <input type="email" id="comp-email" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Contoh: info@swalayanmaga.com">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Perusahaan</label>
                            <input type="text" id="comp-npwp" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Contoh: 01.234.567.8-901.000">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                        <textarea id="comp-address" rows="3" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Masukkan alamat operasional lengkap cabang..."></textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Upload Logo Perusahaan (Maks. 192px)</label>
                            <input type="file" id="comp-logo-file" accept="image/*" class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-none focus:outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                            <p class="text-[10px] text-slate-400 mt-1">Otomatis diresize & dikompresi maksimal 192 piksel.</p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Pratinjau Logo</label>
                            <div id="preview-logo-container" class="h-28 w-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                <span class="text-xs text-slate-400 text-center px-2">Belum ada logo</span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="submit" id="btn-save-comp" class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition rounded-none cursor-pointer flex items-center justify-center gap-2">
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Tab Content 2: Company Profile Narasi dengan Toolbar Format Teks -->
            <div id="tab-content-narasi" class="hidden bg-white border border-slate-200 p-4 sm:p-6 shadow-xs rounded-none">
                <form id="form-company-profile" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Judul / Profil Singkat Perusahaan</label>
                        <input type="text" id="narrative-title" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Contoh: Tentang Maga Swalayan">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Visi Perusahaan</label>
                        <textarea id="narrative-vision" rows="2" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Masukkan visi perusahaan..."></textarea>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Misi Perusahaan</label>
                        <textarea id="narrative-mission" rows="3" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition" placeholder="Masukkan poin-poin misi perusahaan..."></textarea>
                    </div>

                    <!-- Sejarah & Deskripsi Lengkap dengan Toolbar Format Teks -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="block text-xs font-semibold text-slate-700">Sejarah & Deskripsi Lengkap Company Profile</label>
                            <!-- Toolbar Tombol Format -->
                            <div class="flex flex-wrap items-center gap-1 bg-slate-100 p-1 border border-slate-200">
                                <button type="button" onclick="formatText('bold')" class="px-2 py-1 text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Tebal (Bold)">B</button>
                                <button type="button" onclick="formatText('italic')" class="px-2 py-1 text-[11px] italic bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Miring (Italic)">I</button>
                                <button type="button" onclick="formatText('underline')" class="px-2 py-1 text-[11px] underline bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Garis Bawah (Underline)">U</button>
                                <span class="w-[1px] h-4 bg-slate-300 mx-0.5"></span>
                                <button type="button" onclick="formatText('left')" class="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Rata Kiri">⫷</button>
                                <button type="button" onclick="formatText('center')" class="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Tengah">⫾</button>
                                <button type="button" onclick="formatText('right')" class="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Rata Kanan">⫸</button>
                                <button type="button" onclick="formatText('justify')" class="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Rata Kanan-Kiri">≣</button>
                                <span class="w-[1px] h-4 bg-slate-300 mx-0.5"></span>
                                <button type="button" onclick="formatText('list')" class="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer" title="Daftar Berurutan / Bullet">1.</button>
                            </div>
                        </div>
                        <textarea id="narrative-history" rows="6" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-indigo-600 transition font-mono" placeholder="Tuliskan latar belakang, sejarah, atau narasi lengkap profil perusahaan di sini..."></textarea>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="submit" id="btn-save-narrative" class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition rounded-none cursor-pointer flex items-center justify-center gap-2">
                            <span>Simpan Company Profile</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Fungsi global untuk menangani format teks pada textarea Sejarah/Deskripsi
window.formatText = function(type) {
    const textarea = document.getElementById('narrative-history');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const fullText = textarea.value;

    let replacement = '';

    switch (type) {
        case 'bold':
            replacement = `**${selectedText || 'Teks Tebal'}**`;
            break;
        case 'italic':
            replacement = `*${selectedText || 'Teks Miring'}*`;
            break;
        case 'underline':
            replacement = `<u>${selectedText || 'Teks Bergaris Bawah'}</u>`;
            break;
        case 'left':
            replacement = `<div style="text-align: left;">${selectedText || 'Teks Rata Kiri'}</div>`;
            break;
        case 'center':
            replacement = `<div style="text-align: center;">${selectedText || 'Teks Tengah'}</div>`;
            break;
        case 'right':
            replacement = `<div style="text-align: right;">${selectedText || 'Teks Rata Kanan'}</div>`;
            break;
        case 'justify':
            replacement = `<div style="text-align: justify;">${selectedText || 'Teks Rata Kanan-Kiri'}</div>`;
            break;
        case 'list':
            replacement = `\n1. ${selectedText || 'Poin pertama'}\n2. Poin kedua\n3. Poin ketiga\n`;
            break;
        default:
            return;
    }

    textarea.value = fullText.substring(0, start) + replacement + fullText.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
};

export async function initPengaturanHandler() {
    // Tab Elements
    const tabBtnProfil = document.getElementById('tab-btn-profil');
    const tabBtnNarasi = document.getElementById('tab-btn-narasi');
    const tabContentProfil = document.getElementById('tab-content-profil');
    const tabContentNarasi = document.getElementById('tab-content-narasi');

    if (tabBtnProfil && tabBtnNarasi && tabContentProfil && tabContentNarasi) {
        tabBtnProfil.onclick = () => {
            tabBtnProfil.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 text-indigo-600 transition flex items-center gap-2 cursor-pointer";
            tabBtnNarasi.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition flex items-center gap-2 cursor-pointer";
            tabContentProfil.classList.remove('hidden');
            tabContentNarasi.classList.add('hidden');
        };

        tabBtnNarasi.onclick = () => {
            tabBtnNarasi.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 text-indigo-600 transition flex items-center gap-2 cursor-pointer";
            tabBtnProfil.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition flex items-center gap-2 cursor-pointer";
            tabContentNarasi.classList.remove('hidden');
            tabContentProfil.classList.add('hidden');
        };
    }

    const form = document.getElementById('form-pengaturan-perusahaan');
    const nameInput = document.getElementById('comp-name');
    const phoneInput = document.getElementById('comp-phone');
    const emailInput = document.getElementById('comp-email');
    const npwpInput = document.getElementById('comp-npwp');
    const addressInput = document.getElementById('comp-address');
    
    const inputFile = document.getElementById('comp-logo-file');
    const inputLogoBase64 = document.getElementById('comp-logo-base64');
    const previewContainer = document.getElementById('preview-logo-container');

    // Narrative Form Elements
    const formNarrative = document.getElementById('form-company-profile');
    const narrativeTitle = document.getElementById('narrative-title');
    const narrativeVision = document.getElementById('narrative-vision');
    const narrativeMission = document.getElementById('narrative-mission');
    const narrativeHistory = document.getElementById('narrative-history');

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
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    const compressImage = (file, maxDimension = 192, quality = 0.8) => {
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
                    const compressedBase64 = await compressImage(file, 192, 0.8);
                    inputLogoBase64.value = compressedBase64;
                    previewContainer.innerHTML = `<img src="${compressedBase64}" alt="Logo Preview" class="w-full h-full object-contain">`;
                } catch (err) {
                    console.error("Gagal memproses gambar logo:", err);
                    showToast("Gagal memproses file gambar logo.", "error");
                }
            }
        };
    }

    // Load Profil Perusahaan
    try {
        const docRef = doc(db, "pengaturan", "profil_perusahaan");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (nameInput) nameInput.value = data.nama || '';
            if (phoneInput) phoneInput.value = data.telepon || '';
            if (emailInput) emailInput.value = data.email || '';
            if (npwpInput) npwpInput.value = data.npwp || '';
            if (addressInput) addressInput.value = data.alamat || '';
            
            if (data.logo) {
                if (inputLogoBase64) inputLogoBase64.value = data.logo;
                if (previewContainer) {
                    previewContainer.innerHTML = `<img src="${data.logo}" alt="Logo Preview" class="w-full h-full object-contain">`;
                }
            }
        }
    } catch (err) {
        console.error("Gagal memuat profil perusahaan:", err);
    }

    // Load Company Profile Narasi
    try {
        const docRefNarasi = doc(db, "pengaturan", "company_profile_narasi");
        const snapNarasi = await getDoc(docRefNarasi);
        if (snapNarasi.exists()) {
            const nData = snapNarasi.data();
            if (narrativeTitle) narrativeTitle.value = nData.judul || '';
            if (narrativeVision) narrativeVision.value = nData.visi || '';
            if (narrativeMission) narrativeMission.value = nData.misi || '';
            if (narrativeHistory) narrativeHistory.value = nData.sejarah || '';
        }
    } catch (err) {
        console.error("Gagal memuat narasi company profile:", err);
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-save-comp');
            
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                `;
            }

            try {
                const payload = {
                    nama: nameInput.value,
                    telepon: phoneInput.value,
                    email: emailInput.value,
                    npwp: npwpInput.value,
                    alamat: addressInput.value,
                    updatedAt: new Date().toISOString()
                };

                const logoVal = inputLogoBase64.value;
                if (logoVal) {
                    payload.logo = logoVal;
                }

                await setDoc(doc(db, "pengaturan", "profil_perusahaan"), payload);
                showToast("Profil perusahaan berhasil disimpan!", "success");
            } catch (err) {
                console.error("Gagal menyimpan profil:", err);
                showToast("Terjadi kesalahan saat menyimpan data.", "error");
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = `<span>Simpan Perubahan</span>`;
                }
            }
        };
    }

    if (formNarrative) {
        formNarrative.onsubmit = async (e) => {
            e.preventDefault();
            const btnNarasi = document.getElementById('btn-save-narrative');
            
            if (btnNarasi) {
                btnNarasi.disabled = true;
                btnNarasi.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                `;
            }

            try {
                const payloadNarasi = {
                    judul: narrativeTitle.value,
                    visi: narrativeVision.value,
                    misi: narrativeMission.value,
                    sejarah: narrativeHistory.value,
                    updatedAt: new Date().toISOString()
                };

                await setDoc(doc(db, "pengaturan", "company_profile_narasi"), payloadNarasi);
                showToast("Company Profile berhasil disimpan!", "success");
            } catch (err) {
                console.error("Gagal menyimpan company profile:", err);
                showToast("Terjadi kesalahan saat menyimpan narasi.", "error");
            } finally {
                if (btnNarasi) {
                    btnNarasi.disabled = false;
                    btnNarasi.innerHTML = `<span>Simpan Company Profile</span>`;
                }
            }
        };
    }
}