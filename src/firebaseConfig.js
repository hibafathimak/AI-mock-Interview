// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider ,signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2HSLWIEhUbAU8xNRYShNbQDrgu11SGD0",
  authDomain: "mock-interview-ai-cbb57.firebaseapp.com",
  projectId: "mock-interview-ai-cbb57",
  storageBucket: "mock-interview-ai-cbb57.firebasestorage.app",
  messagingSenderId: "9411874316",
  appId: "1:9411874316:web:09fd036fa509208ea1e829",
  measurementId: "G-PEYG1GBEWJ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Googleprovider = new GoogleAuthProvider();



export { auth , Googleprovider}