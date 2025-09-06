// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // <-- Use getAuth, not auth

// Replace with your Firebase values from Project Settings → Web App
const firebaseConfig = {
  apiKey: "AIzaSyC6uSVtyFGgot7IqKkrxn2GEnfY8lkrpDA",
  authDomain: "myapp-488ef.firebaseapp.com",
  projectId: "myapp-488ef",
  storageBucket: "myapp-488ef.appspot.com",
  messagingSenderId: "53909885361",
  appId: "1:53909885361:web:abcd1234ef56789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);
