// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuyuaTKSVoYPL_jULs3M0cusDPIRdZA-U",
  authDomain: "ai-agent-559b0.firebaseapp.com",
  projectId: "ai-agent-559b0",
  storageBucket: "ai-agent-559b0.firebasestorage.app",
  messagingSenderId: "240027436423",
  appId: "1:240027436423:web:040ec770d1a8bb0582ff22",
  measurementId: "G-9KPB2CGKHZ"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize only if window or Platform.OS === 'web'
let app;
if (typeof window !== "undefined" || Platform.OS === "web") {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

//Before
// const analytics = getAnalytics(app);

//After
// Only call analytics in browser environment
let analytics = null;
if (typeof window !== "undefined" && app) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.log("Analytics not supported in this environment");
  }
}

// Initialize Firestore
export const firestoreDb = app?getFirestore(app):null;