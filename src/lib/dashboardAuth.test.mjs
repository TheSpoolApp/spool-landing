import test from 'node:test';
import assert from 'node:assert/strict';
import { dashboardAuthDomain, prefersRedirect, signInErrorMessage, startDashboardSignIn } from './dashboardAuth.mjs';

function setup({ mobile = false, hostname = 'www.thespoolapp.com', popupError, blockedStorage = false } = {}) {
  const calls = [];
  const store = new Map();
  return { calls, store, args: {
    auth: { config: { authDomain: 'www.thespoolapp.com' } }, provider: {},
    popup: async () => { calls.push('popup'); if (popupError) throw { code: popupError }; return 'credential'; },
    redirect: async () => { calls.push('redirect'); return 'redirecting'; },
    browser: { location: { hostname }, navigator: { userAgent: mobile ? 'Mozilla/5.0 (iPhone) CriOS/144' : 'Chrome/144' },
      sessionStorage: { setItem(k,v) { if (blockedStorage) throw new Error('denied'); store.set(k,v); }, getItem: k=>store.get(k), removeItem: k=>store.delete(k) } },
  } };
}

test('canonical host uses same-origin auth; previews and localhost retain registered fallback', () => {
  for (const host of ['', 'localhost', 'preview.vercel.app', 'thespoolapp.com', 'www.thespoolapp.com.evil.test']) {
    assert.equal(dashboardAuthDomain(host, 'spool-a5020.firebaseapp.com'), 'spool-a5020.firebaseapp.com');
  }
  assert.equal(dashboardAuthDomain('www.thespoolapp.com', 'old'), 'www.thespoolapp.com');
});
test('iPhone Chrome and desktop-mode iPad prefer redirect, ordinary Mac stays popup', () => {
  assert.equal(prefersRedirect({ userAgent: 'CriOS/144 iPhone' }), true);
  assert.equal(prefersRedirect({ userAgent: 'Safari', platform: 'MacIntel', maxTouchPoints: 5 }), true);
  assert.equal(prefersRedirect({ platform: 'MacIntel', maxTouchPoints: 0 }), false);
});
test('mobile starts same-origin redirect without opening a popup and removes storage probe', async () => {
  const { args, calls, store } = setup({ mobile: true });
  assert.equal(await startDashboardSignIn(args), 'redirecting');
  assert.deepEqual(calls, ['redirect']); assert.equal(store.size, 0);
});
test('mobile with blocked session storage stays on the dashboard with actionable error', async () => {
  const { args, calls } = setup({ mobile: true, blockedStorage: true });
  await assert.rejects(startDashboardSignIn(args), { code: 'auth/web-storage-unsupported' });
  assert.deepEqual(calls, []);
  assert.match(signInErrorMessage({ code: 'auth/web-storage-unsupported' }), /regular browser tab/);
});
test('desktop popup returns credential; blocked popup falls back to same-origin redirect', async () => {
  const good = setup(); assert.equal(await startDashboardSignIn(good.args), 'credential');
  assert.deepEqual(good.calls, ['popup']);
  const blocked = setup({ popupError: 'auth/popup-blocked' });
  await startDashboardSignIn(blocked.args); assert.deepEqual(blocked.calls, ['popup', 'redirect']);
});
test('cancelling Google sign-in never restarts authentication', async () => {
  for (const code of ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/network-request-failed']) {
    const { args, calls } = setup({ popupError: code });
    await assert.rejects(startDashboardSignIn(args), { code });
    assert.deepEqual(calls, ['popup']);
  }
});
test('cross-origin fallback never attempts unsafe redirect even on mobile', async () => {
  const { args, calls } = setup({ mobile: true, hostname: 'localhost', popupError: 'auth/popup-blocked' });
  await assert.rejects(startDashboardSignIn(args), { code: 'auth/popup-blocked' });
  assert.deepEqual(calls, ['popup']);
});
test('user errors never include raw provider payloads or credentials', () => {
  assert.equal(signInErrorMessage({ message: 'private provider response', code: 'unknown' }).includes('private'), false);
  assert.match(signInErrorMessage({ code: 'auth/network-request-failed' }), /connection/);
});
