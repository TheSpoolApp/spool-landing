import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { firebaseConfig } from './firebaseConfig.mjs';
import { dashboardAuthDomain } from '../lib/dashboardAuth.mjs';

const app = initializeApp({
  ...firebaseConfig,
  authDomain: dashboardAuthDomain(
    typeof window === 'undefined' ? '' : window.location.hostname,
    firebaseConfig.authDomain,
  ),
});
export const db = getFirestore(app);
export const auth = getAuth(app);
export const cloudFunctions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
