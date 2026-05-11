import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import {  initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhqfbpnWC95OZr7b22yUsVpI8G63cDa6I",
  authDomain: "todo-3691f.firebaseapp.com",
  databaseURL: "https://todo-3691f-default-rtdb.firebaseio.com",
  projectId: "todo-3691f",
  storageBucket: "todo-3691f.firebasestorage.app",
  messagingSenderId: "740771819114",
  appId: "1:740771819114:web:11e41d996f835a2b2ba413",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// console.log(auth);

export const db = getFirestore(app);

export const storage = getStorage(app);
export const database = getDatabase(app);
