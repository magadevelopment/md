// Import the functions you need from the SDKs you need via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Konfigurasi Firebase Anda yang sudah valid
const firebaseConfig = {
    apiKey: "AIzaSyCMDvjNNbGWlN8Uz3Paf-YNgvsQwNeM3IY",
    authDomain: "md-maga.firebaseapp.com",
    projectId: "md-maga",
    storageBucket: "md-maga.firebasestorage.app",
    messagingSenderId: "843305736045",
    appId: "1:843305736045:web:5c7b8116eb4e263ab0ac64",
    measurementId: "G-Q7BVR3XNJS"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Ekspor auth dan db agar dapat diimpor oleh router.js atau file lainnya
export const auth = getAuth(app);
export const db = getFirestore(app);