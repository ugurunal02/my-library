// =====================================================
// BURAYA KENDİ FIREBASE AYARLARINIZI GİRİN
// Firebase Console > Project Settings > Your Apps
// =====================================================
const firebaseConfig = {
  apiKey: "AIzaSyCzFiK-_AzAOWq9Ffm2rXMAXI48GZJtsWI",
  authDomain: "mylibrary-1d84a.firebaseapp.com",
  projectId: "mylibrary-1d84a",
  storageBucket: "mylibrary-1d84a.firebasestorage.app",
  messagingSenderId: "1030099014949",
  appId: "1:1030099014949:web:0a3a379d2d5aaa703f36cc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
