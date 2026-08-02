import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  initializeAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA803bLf9zroda2a7dQK_uWeFiPKsc_k7E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dragolink-1c9ff.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dragolink-1c9ff",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dragolink-1c9ff.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "494908669200",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:494908669200:web:54a41fc621cab0da117995",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5TTX688Y8L"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Use initializeAuth instead of getAuth to set persistence at creation time.
// getAuth() defaults to IndexedDB which crashes with "Database is closing/hidden"
// when browser hides the parent tab during popup auth.
// browserLocalPersistence uses localStorage — no connection issues.
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
