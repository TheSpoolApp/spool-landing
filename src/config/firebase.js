import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { firebaseConfig } from './firebaseConfig.mjs';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const cloudFunctions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
