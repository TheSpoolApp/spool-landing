import { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth';
import { signInErrorMessage, startDashboardSignIn } from '../lib/dashboardAuth.mjs';

// Several dashboard panels mount this hook. Consume the redirect once per page.
let redirectResult;
function finishRedirect() {
  redirectResult ??= getRedirectResult(auth);
  return redirectResult;
}

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!active) return;
      setUser(u);
      setAuthLoading(false);
      if (u) setAuthError('');
    }, (error) => {
      if (!active) return;
      setAuthError(signInErrorMessage(error));
      setAuthLoading(false);
    });
    finishRedirect().catch(error => {
      if (active) setAuthError(signInErrorMessage(error));
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const handleSignIn = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSigningIn(true);
    setAuthError('');
    try {
      await startDashboardSignIn({ auth, provider: googleProvider,
        popup: signInWithPopup, redirect: signInWithRedirect, browser: window });
    } catch (error) {
      setAuthError(signInErrorMessage(error));
    } finally {
      inFlight.current = false;
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthError('');
    } catch {
      setAuthError('Sign-out could not finish. Please try again.');
    }
  };

  return { user, authLoading, signingIn, authError, handleSignIn, handleSignOut };
}
