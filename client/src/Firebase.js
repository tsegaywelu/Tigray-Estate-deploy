// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mekelle-estate-a4362.firebaseapp.com",
  projectId: "mekelle-estate-a4362",
  storageBucket: "mekelle-estate-a4362.appspot.com",
  messagingSenderId: "982968412829",
  appId: "1:982968412829:web:29434675f6bb5ef666c274"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);