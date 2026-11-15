export function renderContact() {
    return `
        <h2 class="text-2xl font-bold text-blue-600 mb-3">Hubungi Kami</h2>
        <p class="text-slate-600 mb-4">Silakan kirimkan pertanyaan atau pesan melalui formulir di bawah ini:</p>
        <form class="space-y-4" onsubmit="event.preventDefault(); alert('Pesan berhasil disimulasikan terkirim!');">
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                <input type="text" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                <textarea class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" rows="3" required></textarea>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Kirim Pesan</button>
        </form>
    `;
}