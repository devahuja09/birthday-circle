import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy4JINPhmEBZpr_PQWPYLbRViIjS2x67g",
  authDomain: "birthdaycircle-24cee.firebaseapp.com",
  projectId: "birthdaycircle-24cee",
  storageBucket: "birthdaycircle-24cee.firebasestorage.app",
  messagingSenderId: "732183140670",
  appId: "1:732183140670:web:f9b3c2b07fff70afd1746f",
  measurementId: "G-Z3R9D5YZJP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;