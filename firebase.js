// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRSYqBVUTpXMuYfzu0fezhAi08fnGcEg0",
  authDomain: "instagram-b62ec.firebaseapp.com",
  projectId: "instagram-b62ec",
  storageBucket: "instagram-b62ec.appspot.com",
  messagingSenderId: "834479094225",
  appId: "1:834479094225:web:6558c66d2d9140bc1f88f0",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
