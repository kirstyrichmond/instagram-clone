// // Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRSYqBVUTpXMuYfzu0fezhAi08fnGcEg0",
  authDomain: "instagram-b62ec.firebaseapp.com",
  projectId: "instagram-b62ec",
  storageBucket: "instagram-b62ec.appspot.com",
  messagingSenderId: "834479094225",
  appId: "1:834479094225:web:6558c66d2d9140bc1f88f0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

const auth = getAuth(app);

export { auth };

export { app, db, storage };
