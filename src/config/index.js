import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBBgwrRwPwyAuckgA45idE11CH6jsFCZhI",
  authDomain: "dengue-478f6.firebaseapp.com",
  databaseURL: "https://dengue-478f6-default-rtdb.firebaseio.com",
  projectId: "dengue-478f6",
  storageBucket: "dengue-478f6.appspot.com",
  messagingSenderId: "583624630497",
  appId: "1:583624630497:web:2408f672c98a05706497a0",
  measurementId: "G-HZ6XMSEDMF",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
