import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function trim(value) {
  return typeof value === "string" ? value.trim() : "";
}

const firebaseConfig = {
  apiKey: trim(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: trim(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: trim(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: trim(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trim(
    import.meta.env.VITE_FIREBASE_SENDER_ID ||
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: trim(import.meta.env.VITE_FIREBASE_APP_ID),
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing VITE_FIREBASE_API_KEY. Add it in .env and restart the dev server.",
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
