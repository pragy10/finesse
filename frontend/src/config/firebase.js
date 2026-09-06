import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrPc8b048SLIAJKsGIjcNOVXCcTTXrk1c",
  authDomain: "finesse-57eb2.firebaseapp.com",
  projectId: "finesse-57eb2",
  storageBucket: "finesse-57eb2.firebasestorage.app",
  messagingSenderId: "468759520474",
  appId: "1:468759520474:web:321149f90c51015920f1e3",
  measurementId: "G-SFY4LX99ES"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  onAuthStateChanged 
};
