import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if Firebase env vars are available
const hasFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

let firebaseApp = null;
let auth = null;
let db = null;
let storage = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  try {
    // Avoid double initialization in HMR (Hot Module Replacement)
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    console.log("Firebase initialized successfully in Firestore Mode.");
  } catch (error) {
    console.warn("Failed to initialize real Firebase services. Falling back to Mock Mode.", error);
  }
} else {
  console.log("Firebase API Key is missing. Operating in Mock LocalStorage Mode.");
}

export { auth, db, storage, hasFirebaseConfig };
export default firebaseApp;
