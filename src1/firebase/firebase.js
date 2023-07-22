import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCg4ChKndCU1rqIOiaAJZGvgXtrbAc3gnM',
  authDomain: 'customize-ui-353ee.firebaseapp.com',
  projectId: 'customize-ui-353ee',
  storageBucket: 'customize-ui-353ee.appspot.com',
  messagingSenderId: '792022776841',
  appId: '1:792022776841:web:9c2cd58307d8c1f82a4cd8',
  measurementId: 'G-5DZHLX06RS',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);
const storeactions = { doc, setDoc, getDoc, collection };
const auth = {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
};

export { storage, firestore, storeactions, auth };
