import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCs9uliRz0v6x-fd5G9xlIwHEyb3FeCLLo",
  authDomain: "dengue-a246d.firebaseapp.com",
  databaseURL: "https://dengue-a246d-default-rtdb.firebaseio.com",
  projectId: "dengue-a246d",
  storageBucket: "dengue-a246d.appspot.com",
  messagingSenderId: "545129573288",
  appId: "1:545129573288:web:5159264e9feb04035d8b9d",
  measurementId: "G-V2K77GF8EF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
