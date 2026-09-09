/**
 * Firebase Client Initialization & Configuration Structure
 * SIH26033 FarmDirect Platform
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Default / fallback configuration structure
const defaultFirebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForFarmDirectFoundation2026",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "farmdirect-sih2026.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "farmdirect-sih2026",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "farmdirect-sih2026.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:1029384756:web:farmdirectfoundation",
  firestoreDatabaseId: "(default)",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isFirebaseLive = false;

try {
  if (!getApps().length) {
    app = initializeApp(defaultFirebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    auth = getAuth(app);
    // Initialize Firestore
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseLive = true;
  }
} catch (error) {
  console.warn("Firebase initialization in fallback/offline mode:", error);
  isFirebaseLive = false;
}

export { app, auth, db, storage, isFirebaseLive, defaultFirebaseConfig };
