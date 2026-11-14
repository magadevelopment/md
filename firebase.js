// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMDvjNNbGWlN8Uz3Paf-YNgvsQwNeM3IY",
    authDomain: "md-maga.firebaseapp.com",
    projectId: "md-maga",
    storageBucket: "md-maga.firebasestorage.app",
    messagingSenderId: "843305736045",
    appId: "1:843305736045:web:5c7b8116eb4e263ab0ac64",
    measurementId: "G-Q7BVR3XNJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export agar bisa dipanggil di file HTML lainnya (index.html, form.html, riwayat.html)
export { app, auth, db, analytics, firebaseConfig };