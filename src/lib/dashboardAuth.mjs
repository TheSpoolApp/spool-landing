export const DASHBOARD_AUTH_DOMAIN = 'www.thespoolapp.com';

// Only the production domain has the matching proxy and registered OAuth callback.
// Local development and preview origins keep Firebase's original popup flow.
export function dashboardAuthDomain(hostname, fallback) {
  return hostname === DASHBOARD_AUTH_DOMAIN ? DASHBOARD_AUTH_DOMAIN : fallback;
}

export function prefersRedirect(navigator = {}) {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function signInErrorMessage(error) {
  switch (error?.code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Tap Sign In to try again in this browser.';
    case 'auth/popup-blocked':
      return 'The sign-in window was blocked. Allow popups for this site, then try again.';
    case 'auth/web-storage-unsupported':
    case 'auth/missing-initial-state':
      return 'Your browser could not keep the sign-in session. Open the dashboard in a regular browser tab and start Sign In again there.';
    case 'auth/network-request-failed':
      return 'Could not reach Google sign-in. Check your connection and try again.';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
      return 'Sign-in is not configured for this website. Open https://www.thespoolapp.com/analytics and try again.';
    default:
      return 'Sign-in could not finish. Return to the dashboard and try again in the same browser.';
  }
}

function requireSessionStorage(browser) {
  try {
    const key = 'spool:auth-storage-check';
    browser.sessionStorage.setItem(key, '1');
    if (browser.sessionStorage.getItem(key) !== '1') throw new Error('Storage unavailable');
    browser.sessionStorage.removeItem(key);
  } catch {
    throw Object.assign(new Error('Browser session storage is unavailable'), { code: 'auth/web-storage-unsupported' });
  }
}

export async function startDashboardSignIn({ auth, provider, popup, redirect, browser }) {
  const sameOrigin = browser.location.hostname === auth.config.authDomain;
  const redirectInThisTab = () => {
    requireSessionStorage(browser);
    return redirect(auth, provider);
  };
  if (sameOrigin && prefersRedirect(browser.navigator)) return redirectInThisTab();
  try {
    return await popup(auth, provider);
  } catch (error) {
    // A blocked popup has not begun authentication; safely retry in this tab.
    // Never turn an intentional cancellation into another sign-in attempt.
    if (sameOrigin && error?.code === 'auth/popup-blocked') return redirectInThisTab();
    throw error;
  }
}
