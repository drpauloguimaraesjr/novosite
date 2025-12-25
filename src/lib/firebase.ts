import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Lazy initialization to avoid errors during build
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  
  // Check if we have the required env vars
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.log("[Firebase] Skipping initialization - no API key available");
    return null;
  }

  const firebaseConfig = {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return app;
  } catch (error) {
    console.error("[Firebase] Initialization failed:", error);
    return null;
  }
}

function getDb(): Firestore | null {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}

function getAuthInstance(): Auth | null {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);
  return auth;
}

function getStorageInstance(): FirebaseStorage | null {
  if (storage) return storage;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  storage = getStorage(firebaseApp);
  return storage;
}

// Export getters
export { getDb as db, getAuthInstance as auth, getStorageInstance as storage, getFirebaseApp };
