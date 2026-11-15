export function renderHome() {
    return `
        <div class="space-y-6">
            
            <!-- Banner Utama Selamat Datang -->
            <div class="bg-indigo-900 text-white p-6 rounded-none shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="space-y-1 z-10">
                    <span class="inline-block bg-indigo-700 text-indigo-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-none tracking-wide uppercase">MEMUAT ROLE...</span>
                    <h1 class="text-2xl font-bold tracking-tight">Selamat Datang, Ismanto Aithy! 👋</h1>
                </div>
                <div class="bg-indigo-800/80 border border-indigo-700 text-indigo-100 text-xs px-3 py-1.5 rounded-none flex items-center gap-2 z-10">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Sistem Merchandising Aktif
                </div>
            </div>

            <!-- Banner & Informasi Utama -->
            <div class="bg-white p-5 rounded-none border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">BANNER & INFORMASI UTAMA</h3>
                    <div class="flex gap-1">
                        <button class="p-1.5 border border-slate-200 rounded-none hover:bg-slate-50 text-slate-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <button class="p-1.5 border border-slate-200 rounded-none hover:bg-slate-50 text-slate-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                    </div>
                </div>

                <!-- Slider / Card Gambar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Card 1 -->
                    <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition">
                        <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80" alt="Produk" class="w-full h-36 object-cover">
                        <div class="p-3">
                            <p class="text-sm font-medium text-slate-700">Enak</p>
                        </div>
                    </div>
                    <!-- Card 2 -->
                    <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition">
                        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80" alt="Produk" class="w-full h-36 object-cover">
                        <div class="p-3">
                            <p class="text-sm font-medium text-slate-700">Aku</p>
                        </div>
                    </div>
                    <!-- Card 3 -->
                    <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition">
                        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80" alt="Produk" class="w-full h-36 object-cover">
                        <div class="p-3">
                            <p class="text-sm font-medium text-slate-700">Dia</p>
                        </div>
                    </div>
                    <!-- Card 4 -->
                    <div class="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs hover:shadow-md transition">
                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80" alt="Produk" class="w-full h-36 object-cover">
                        <div class="p-3">
                            <p class="text-sm font-medium text-slate-700">Kamu</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Menu Pintasan Cepat -->
            <div class="space-y-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">MENU PINTASAN CEPAT</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="#/daftar" data-link class="bg-white p-4 rounded-none border border-slate-200 shadow-xs hover:border-indigo-300 transition flex items-center justify-between group">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-none bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">📋</div>
                            <div>
                                <h4 class="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition">Daftar Pendaftaran</h4>
                                <p class="text-xs text-slate-400">Tambah data distributor dan produk baru</p>
                            </div>
                        </div>
                        <svg class="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>

        </div>
    `;
}