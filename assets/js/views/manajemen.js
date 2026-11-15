export function renderManajemen() {
    return `
        <div class="space-y-6">
            <h1 class="text-xl font-bold text-slate-800">Pengaturan & Manajemen</h1>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <!-- Manajemen Branding -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/manajemen-branding'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Manajemen Branding</span>
                </div>

                <!-- Manajemen Event -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/event'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Manajemen Event</span>
                </div>

                <!-- Produk -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/produk'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Produk</span>
                </div>

                <!-- Banner -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/banner'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Banner</span>
                </div>

                <!-- Kelola Lokasi -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/lokasi'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Kelola Lokasi</span>
                </div>

                <!-- Running Text -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/text'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Running Text</span>
                </div>

                <!-- Pendaftaran -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/pendaftaran'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Pendaftaran</span>
                </div>

                <!-- Pengaturan -->
                <div class="bg-white p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center text-center group cursor-pointer rounded-none" onclick="location.hash='#/pengaturan'">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition mb-3 rounded-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756.2924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">Pengaturan</span>
                </div>
            </div>
        </div>
    `;
}