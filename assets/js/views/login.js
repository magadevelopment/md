import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "../firebase-init.js";

export function renderLogin() {
    return `
        <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h2 class="text-2xl font-bold text-blue-600 mb-2 text-center">Login Maga Swalayan</h2>
            <p class="text-slate-500 text-sm mb-6 text-center">Silakan masuk menggunakan akun email Anda.</p>
            
            <div id="error-msg" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg"></div>

            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" id="email" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" id="password" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">Masuk</button>
            </form>

            <div class="mt-4 text-center">
                <span class="text-slate-400 text-sm">Atau</span>
            </div>

            <button id="btn-google" class="w-full mt-4 border border-slate-300 bg-white text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.18 21.32 7.23 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Masuk dengan Google
            </button>
        </div>
    `;
}

export function initLoginHandler() {
    const form = document.getElementById('login-form');
    const btnGoogle = document.getElementById('btn-google');
    const errorBox = document.getElementById('error-msg');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorBox.classList.add('hidden');

            try {
                await signInWithEmailAndPassword(auth, email, password);
                location.hash = '#/';
            } catch (error) {
                errorBox.textContent = `Gagal Login: ${error.message}`;
                errorBox.classList.remove('hidden');
            }
        });
    }

    if (btnGoogle) {
        btnGoogle.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            errorBox.classList.add('hidden');
            try {
                await signInWithPopup(auth, provider);
                location.hash = '#/';
            } catch (error) {
                errorBox.textContent = `Gagal Login Google: ${error.message}`;
                errorBox.classList.remove('hidden');
            }
        });
    }
}