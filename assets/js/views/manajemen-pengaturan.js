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

            <!-- Modal Input Nomor WhatsApp yang Smooth -->
            <div id="whatsapp-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 transition-opacity duration-200">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full p-5 rounded-none space-y-4">
                    <div>
                        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Kirim Link via WhatsApp</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Masukkan nomor WhatsApp tujuan (misal: 08123456789).</p>
                    </div>
                    <div>
                        <input type="text" id="wa-target-number" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: 08123456789">
                    </div>
                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" id="btn-wa-cancel" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition rounded-none cursor-pointer">
                            Batal
                        </button>
                        <button type="button" id="btn-wa-submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                            Kirim Pesan
                        </button>
                    </div>
                </div>
            </div>

            <!-- Header Halaman & Tombol Kembali -->
            <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Perusahaan</h1>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola identitas operasional serta narasi Company Profile Swalayan Maga.</p>
                </div>
                <a href="#/manajemen" data-link class="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition rounded-none">
                    <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span>Kembali</span>
                </a>
            </div>

            <!-- Tab Navigation -->
            <div class="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button type="button" id="tab-btn-profil" class="px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    Profil Perusahaan
                </button>
                <button type="button" id="tab-btn-narasi" class="px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Company Profile (Narasi)
                </button>
                <button type="button" id="tab-btn-qrcode" class="px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                    QR Code Web
                </button>
            </div>

            <!-- Tab Content 1: Profil Perusahaan -->
            <div id="tab-content-profil" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs rounded-none">
                <form id="form-pengaturan-perusahaan" class="space-y-4">
                    <input type="hidden" id="comp-logo-base64">
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Perusahaan / Toko</label>
                            <input type="text" id="comp-name" required class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: PT Swalayan Maga Utama">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon / WhatsApp</label>
                            <input type="text" id="comp-phone" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: 081234567890">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Resmi</label>
                            <input type="email" id="comp-email" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: info@swalayanmaga.com">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">NPWP Perusahaan</label>
                            <input type="text" id="comp-npwp" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: 01.234.567.8-901.000">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
                        <textarea id="comp-address" rows="3" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Masukkan alamat operasional lengkap cabang..."></textarea>
                        
                        <!-- Daftar Riwayat Alamat Tersimpan -->
                        <div class="mt-2">
                            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                                <span>Riwayat Alamat Tersimpan (Klik untuk panggil ulang):</span>
                            </div>
                            <div id="address-history-list" class="flex flex-col gap-1.5 max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-none">
                                <span class="text-[11px] text-slate-400 italic">Memuat riwayat alamat...</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Logo Perusahaan (Maks. 192px)</label>
                            <input type="file" id="comp-logo-file" accept="image/*" class="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:dark:bg-indigo-950/60 file:text-indigo-700 file:dark:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer">
                            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Otomatis diresize & dikompresi maksimal 192 piksel.</p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pratinjau Logo</label>
                            <div id="preview-logo-container" class="h-28 w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden relative rounded-none">
                                <span class="text-xs text-slate-400 dark:text-slate-500 text-center px-2">Belum ada logo</span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <button type="submit" id="btn-save-comp" class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold transition rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-md">
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Tab Content 2: Company Profile Narasi dengan Toolbar Format Teks -->
            <div id="tab-content-narasi" class="hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs rounded-none">
                <form id="form-company-profile" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul / Profil Singkat Perusahaan</label>
                        <input type="text" id="narrative-title" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: Tentang Maga Swalayan">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Visi Perusahaan</label>
                        <textarea id="narrative-vision" rows="2" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Masukkan visi perusahaan..."></textarea>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Misi Perusahaan</label>
                        <textarea id="narrative-mission" rows="3" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Masukkan poin-poin misi perusahaan..."></textarea>
                    </div>

                    <!-- Sejarah & Deskripsi Lengkap dengan Toolbar Format Teks -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Sejarah & Deskripsi Lengkap Company Profile</label>
                            <!-- Toolbar Tombol Format -->
                            <div class="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-none">
                                <button type="button" onclick="formatText('bold')" class="px-2 py-1 text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Tebal (Bold)">B</button>
                                <button type="button" onclick="formatText('italic')" class="px-2 py-1 text-[11px] italic bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Miring (Italic)">I</button>
                                <button type="button" onclick="formatText('underline')" class="px-2 py-1 text-[11px] underline bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Garis Bawah (Underline)">U</button>
                                <span class="w-[1px] h-4 bg-slate-300 dark:bg-slate-600 mx-0.5"></span>
                                <button type="button" onclick="formatText('left')" class="px-2 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Rata Kiri">⫷</button>
                                <button type="button" onclick="formatText('center')" class="px-2 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Tengah">⫾</button>
                                <button type="button" onclick="formatText('right')" class="px-2 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Rata Kanan">⫸</button>
                                <button type="button" onclick="formatText('justify')" class="px-2 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Rata Kanan-Kiri">≣</button>
                                <span class="w-[1px] h-4 bg-slate-300 dark:bg-slate-600 mx-0.5"></span>
                                <button type="button" onclick="formatText('list')" class="px-2 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer rounded-none" title="Daftar Berurutan / Bullet">1.</button>
                            </div>
                        </div>
                        <textarea id="narrative-history" rows="6" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition font-mono bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Tuliskan latar belakang, sejarah, atau narasi lengkap profil perusahaan di sini..."></textarea>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <button type="submit" id="btn-save-narrative" class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold transition rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-md">
                            <span>Simpan Company Profile</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Tab Content 3: QR Code Web Aplikasi -->
            <div id="tab-content-qrcode" class="hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs rounded-none space-y-6">
                <div>
                    <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Generator QR Code Web Aplikasi</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Masukkan alamat URL web aplikasi Swalayan Maga untuk membuat QR Code cetak.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat URL Web / PWA</label>
                            <input type="text" id="qrcode-url-input" class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" placeholder="Contoh: https://magadevelopment.github.io/md/">
                        </div>
                        <button type="button" id="btn-generate-qr" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition rounded-none cursor-pointer shadow-md">
                            Buat QR Code
                        </button>
                    </div>

                    <div class="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3 rounded-none">
                        <div id="qrcode-preview-box" class="bg-white p-3 border border-slate-200 flex items-center justify-center min-h-[180px] min-w-[180px] rounded-none">
                            <span class="text-xs text-slate-400 text-center">QR Code akan tampil di sini</span>
                        </div>
                        <div id="qrcode-actions" class="hidden flex flex-wrap justify-center gap-2">
                            <button type="button" id="btn-download-qr" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                                Download QR
                            </button>
                            <button type="button" id="btn-print-qr" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition rounded-none cursor-pointer">
                                Cetak Kartu
                            </button>
                            <button type="button" id="btn-whatsapp-qr" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition rounded-none cursor-pointer flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                Kirim WA
                            </button>
                        </div>
                    </div>
                </div>
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
    const tabBtnQrcode = document.getElementById('tab-btn-qrcode');
    
    const tabContentProfil = document.getElementById('tab-content-profil');
    const tabContentNarasi = document.getElementById('tab-content-narasi');
    const tabContentQrcode = document.getElementById('tab-content-qrcode');

    if (tabBtnProfil && tabBtnNarasi && tabBtnQrcode && tabContentProfil && tabContentNarasi && tabContentQrcode) {
        tabBtnProfil.onclick = () => {
            tabBtnProfil.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 transition flex items-center gap-2 cursor-pointer";
            tabBtnNarasi.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            tabBtnQrcode.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            
            tabContentProfil.classList.remove('hidden');
            tabContentNarasi.classList.add('hidden');
            tabContentQrcode.classList.add('hidden');
        };

        tabBtnNarasi.onclick = () => {
            tabBtnNarasi.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 transition flex items-center gap-2 cursor-pointer";
            tabBtnProfil.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            tabBtnQrcode.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            
            tabContentNarasi.classList.remove('hidden');
            tabContentProfil.classList.add('hidden');
            tabContentQrcode.classList.add('hidden');
        };

        tabBtnQrcode.onclick = () => {
            tabBtnQrcode.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 transition flex items-center gap-2 cursor-pointer";
            tabBtnProfil.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            tabBtnNarasi.className = "px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-2 cursor-pointer";
            
            tabContentQrcode.classList.remove('hidden');
            tabContentProfil.classList.add('hidden');
            tabContentNarasi.classList.add('hidden');
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

    // QR Code Elements
    const qrcodeUrlInput = document.getElementById('qrcode-url-input');
    const btnGenerateQr = document.getElementById('btn-generate-qr');
    const qrcodePreviewBox = document.getElementById('qrcode-preview-box');
    const qrcodeActions = document.getElementById('qrcode-actions');
    const btnDownloadQr = document.getElementById('btn-download-qr');
    const btnPrintQr = document.getElementById('btn-print-qr');
    const btnWhatsappQr = document.getElementById('btn-whatsapp-qr');

    // WhatsApp Modal Elements
    const whatsappModal = document.getElementById('whatsapp-modal');
    const waTargetNumber = document.getElementById('wa-target-number');
    const btnWaCancel = document.getElementById('btn-wa-cancel');
    const btnWaSubmit = document.getElementById('btn-wa-submit');

    // Address History Elements
    const addressHistoryContainer = document.getElementById('address-history-list');

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
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    function renderAddressHistory(historyArray) {
        if (!addressHistoryContainer) return;
        
        if (!historyArray || historyArray.length === 0) {
            addressHistoryContainer.innerHTML = `<span class="text-[11px] text-slate-400 italic">Belum ada riwayat alamat tersimpan.</span>`;
            return;
        }

        addressHistoryContainer.innerHTML = historyArray.map((addr) => `
            <div class="flex items-start justify-between gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs hover:border-indigo-500 transition rounded-none">
                <p class="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-2 flex-1">${addr}</p>
                <button type="button" onclick="window.selectAddress('${encodeURIComponent(addr)}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-[10px] font-semibold transition shrink-0 cursor-pointer rounded-none">
                    Gunakan
                </button>
            </div>
        `).join('');
    }

    window.selectAddress = function(encodedAddr) {
        const decodedAddr = decodeURIComponent(encodedAddr);
        if (addressInput) {
            addressInput.value = decodedAddr;
            showToast("Alamat berhasil dipanggil ulang!", "success");
        }
    };

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

    // Load Profil Perusahaan & Riwayat Alamat
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
            
            if (data.alamatHistory && Array.isArray(data.alamatHistory)) {
                renderAddressHistory(data.alamatHistory);
            } else if (data.alamat) {
                renderAddressHistory([data.alamat]);
            } else {
                renderAddressHistory([]);
            }
            
            if (data.logo) {
                if (inputLogoBase64) inputLogoBase64.value = data.logo;
                if (previewContainer) {
                    previewContainer.innerHTML = `<img src="${data.logo}" alt="Logo Preview" class="w-full h-full object-contain">`;
                }
            }
        } else {
            renderAddressHistory([]);
        }
    } catch (err) {
        console.error("Gagal memuat profil perusahaan:", err);
        renderAddressHistory([]);
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

    // Handler Generate QR Code menggunakan URL default asli GitHub Pages
    if (btnGenerateQr && qrcodeUrlInput && qrcodePreviewBox) {
        if (!qrcodeUrlInput.value) {
            qrcodeUrlInput.value = "https://magadevelopment.github.io/md/";
        }

        btnGenerateQr.onclick = () => {
            const urlVal = qrcodeUrlInput.value.trim();
            if (!urlVal) {
                showToast("Silakan masukkan alamat URL web terlebih dahulu.", "error");
                return;
            }

            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlVal)}`;
            qrcodePreviewBox.innerHTML = `<img src="${qrApiUrl}" alt="QR Code" id="generated-qr-img" class="w-44 h-44 object-contain">`;
            if (qrcodeActions) qrcodeActions.classList.remove('hidden');
            showToast("QR Code berhasil dibuat!", "success");
        };

        btnGenerateQr.click();
    }

    if (btnDownloadQr) {
        btnDownloadQr.onclick = () => {
            const img = document.getElementById('generated-qr-img');
            if (!img) return;
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'QR-Code-MagaSwalayan.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("QR Code berhasil diunduh.", "success");
        };
    }

    if (btnPrintQr) {
        btnPrintQr.onclick = () => {
            const img = document.getElementById('generated-qr-img');
            if (!img) return;
            const printWin = window.open('', '_blank');
            printWin.document.write(`
                <html>
                    <head>
                        <title>Cetak QR Code - Maga Swalayan</title>
                        <style>
                            body { font-family: sans-serif; text-align: center; padding: 40px; }
                            .card { border: 2px dashed #333; padding: 30px; display: inline-block; max-width: 300px; }
                            h2 { margin-bottom: 5px; font-size: 18px; }
                            p { font-size: 12px; color: #666; margin-top: 5px; word-break: break-all; }
                            img { width: 200px; height: 200px; margin: 15px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h2>MAGA SWALAYAN</h2>
                            <p>Scan untuk akses aplikasi & profil digital</p>
                            <img src="${img.src}" />
                            <p><b>${qrcodeUrlInput.value}</b></p>
                        </div>
                        <script>
                            window.onload = function() { window.print(); window.close(); }
                        </script>
                    </body>
                </html>
            `);
            printWin.document.close();
        };
    }

    // Handler Modal WhatsApp Smooth
    if (btnWhatsappQr && whatsappModal && waTargetNumber && btnWaCancel && btnWaSubmit) {
        btnWhatsappQr.onclick = () => {
            const urlVal = qrcodeUrlInput.value.trim();
            if (!urlVal) {
                showToast("URL web belum tersedia.", "error");
                return;
            }
            whatsappModal.classList.remove('hidden');
            waTargetNumber.value = '';
            waTargetNumber.focus();
        };

        const closeModal = () => {
            whatsappModal.classList.add('hidden');
        };

        btnWaCancel.onclick = closeModal;

        whatsappModal.onclick = (e) => {
            if (e.target === whatsappModal) closeModal();
        };

        btnWaSubmit.onclick = () => {
            const nomor = waTargetNumber.value.trim();
            const urlVal = qrcodeUrlInput.value.trim();
            const pesanWap = `Halo, berikut adalah link akses resmi digital dan profil Swalayan Maga:\n${urlVal}\n\nSilakan scan atau klik tautan di atas untuk melihat informasi lengkap. Terima kasih!`;

            closeModal();

            if (typeof window.kirimPesanWhatsApp === 'function') {
                window.kirimPesanWhatsApp(nomor, pesanWap);
            } else {
                let formattedNum = nomor.replace(/\D/g, '');
                if (formattedNum.startsWith('0')) {
                    formattedNum = '62' + formattedNum.slice(1);
                }
                const waUrl = formattedNum ? `https://wa.me/${formattedNum}?text=${encodeURIComponent(pesanWap)}` : `https://wa.me/?text=${encodeURIComponent(pesanWap)}`;
                window.open(waUrl, '_blank');
            }
        };

        waTargetNumber.onkeydown = (e) => {
            if (e.key === 'Enter') {
                btnWaSubmit.click();
            }
        };
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
                let existingHistory = [];
                const docRef = doc(db, "pengaturan", "profil_perusahaan");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().alamatHistory) {
                    existingHistory = docSnap.data().alamatHistory;
                }

                const currentAddress = addressInput.value.trim();
                if (currentAddress && !existingHistory.includes(currentAddress)) {
                    existingHistory.unshift(currentAddress);
                    if (existingHistory.length > 5) existingHistory.pop();
                }

                const payload = {
                    nama: nameInput.value,
                    telepon: phoneInput.value,
                    email: emailInput.value,
                    npwp: npwpInput.value,
                    alamat: currentAddress,
                    alamatHistory: existingHistory,
                    updatedAt: new Date().toISOString()
                };

                const logoVal = inputLogoBase64.value;
                if (logoVal) {
                    payload.logo = logoVal;
                }

                await setDoc(docRef, payload);
                renderAddressHistory(existingHistory);
                showToast("Profil dan riwayat alamat berhasil disimpan!", "success");
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