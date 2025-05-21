// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd4aN1fTUmfK-CUdM7jMMJWb_hKGyqUzo",
  authDomain: "hidraglow-4a744.firebaseapp.com",
  projectId: "hidraglow-4a744",
  storageBucket: "hidraglow-4a744.firebasestorage.app",
  messagingSenderId: "322540074630",
  appId: "1:322540074630:web:0574356b9f46f7f50cc307",
  measurementId: "G-GCNHH5M14C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
export const db = getFirestore(app)
