// initialize Firebase and export auth & db
// Replace the SDK urls' version (9.X.X) with the version you want/see in Firebase docs.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.X.X/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.X.X/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.X.X/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXu-8_142Dtznjefu5WcnrfN6NfcnUQ0E",
  authDomain: "project-351-69c49.firebaseapp.com",
  projectId: "project-351-69c49",
  storageBucket: "project-351-69c49.firebasestorage.app",
  messagingSenderId: "1086240060702",
  appId: "1:1086240060702:web:d7c996434bf202088cc50f",
  measurementId: "G-QYPJBQ7RNH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
