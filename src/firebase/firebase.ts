import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_-1PIaUtbVVUDewaEw137rg0UcHxARe8",
  authDomain: "bludchat-604f0.firebaseapp.com",
  projectId: "bludchat-604f0",
  storageBucket: "bludchat-604f0.appspot.com",
  messagingSenderId: "775705150954",
  appId: "1:775705150954:web:2ac2e4a5a9d33933d95e93",
  measurementId: "G-Y6RRZ7WDNR",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, firestore, auth, provider, storage, firebaseConfig };
