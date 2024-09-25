// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage"; // Firebase Storage (optional)
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Initialize Firebase

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhqfbpnWC95OZr7b22yUsVpI8G63cDa6I",
  authDomain: "todo-3691f.firebaseapp.com",
  projectId: "todo-3691f",
  storageBucket: "todo-3691f.appspot.com",
  messagingSenderId: "740771819114",
  appId: "1:740771819114:web:11e41d996f835a2b2ba413",
  measurementId: "G-5VQ8R1F44C",
  databaseURL: "https://ToDo.firebaseio.com",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore (database)
const db = getFirestore(app);
const database = getDatabase(app);
// Initialize Firebase Storage (optional, if you are using it)
const storage = getStorage(app);

// Export Firebase services for use in other parts of the app
export { app, auth, db, storage, database };
