// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnDAPsBpLFz9hlwI_bfpiuv-L2IBZmDV4",
  authDomain: "pantryaiv2.firebaseapp.com",
  projectId: "pantryaiv2",
  storageBucket: "pantryaiv2.appspot.com",
  messagingSenderId: "526424801710",
  appId: "1:526424801710:web:0db5ce27a68b0e8613083f",
  measurementId: "G-ZVJ6B7WV0G"
};

// Initialize Firebase
export const FIRESTORE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DATABASE = getFirestore(FIRESTORE_APP);
export const FIRESTORE_AUTHENTICATION = getAuth(FIRESTORE_APP)