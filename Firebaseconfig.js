import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB54jFQBipU2v2-r54gRoIj2-hCnvT8yYo",
  authDomain: "security-a22c5.firebaseapp.com",
  projectId: "security-a22c5",
  storageBucket: "security-a22c5.appspot.com",
  messagingSenderId: "1055945328210",
  appId: "1:1055945328210:web:f9ab1a3e7e5e416ae0818b"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_STORAGE =  getStorage(FIREBASE_APP);

export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);