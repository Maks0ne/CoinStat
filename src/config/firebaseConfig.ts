import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDst2_GrrnSyDfQdxLORfoGlNzPPk5DEEU",
  authDomain: "coinsstat-5615d.firebaseapp.com",
  projectId: "coinsstat-5615d",
  storageBucket: "coinsstat-5615d.appspot.com",
  messagingSenderId: "668416121238",
  appId: "1:668416121238:web:0bd30569f78f96a94865b7",
  measurementId: "G-SKD39J659C"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);