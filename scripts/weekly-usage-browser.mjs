// Run against a built local app: npm run start -- --port 3100
// PLAYWRIGHT_MODULE may point to an existing Playwright installation; no production auth bypass.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { firebaseConfig } from '../src/config/firebaseConfig.mjs';
import { computeWeeklyUsage } from '../src/lib/weeklyUsage.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.WEEKLY_USAGE_TEST_URL || 'http://127.0.0.1:3100';
const output = process.env.WEEKLY_USAGE_TEST_OUTPUT || '/tmp/spool-weekly-usage-browser';
await fs.mkdir(output, { recursive: true });
const now = Date.now();
const fixture = process.env.WEEKLY_USAGE_FIXTURE
  ? JSON.parse(await fs.readFile(process.env.WEEKLY_USAGE_FIXTURE, 'utf8'))
  : computeWeeklyUsage({ users: [], asOf: now, excuses: Array.from({ length: 12 }, (_, i) =>
    Array.from({ length: 3 }, (_, w) => Array.from({ length: i < 4 ? 1 : i < 8 ? 3 : 5 }, (_, d) => ({
      userId: `fixture-${i}`, timestamp: now - (28 - w * 7 - d) * 86400000, durationMinutes: 15 - w * 5,
    }))).flat(2)).flat() });
fixture.generatedAt = new Date(now).toISOString();
const empty = computeWeeklyUsage({ users: [], excuses: [], asOf: now });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let calls = 0;
let mode = 'success';
let release;
let lastRefresh = false;
await page.route('**/api/analytics/weekly-usage*', async route => {
  calls++;
  lastRefresh = new URL(route.request().url()).searchParams.get('refresh') === '1';
  if (mode === 'pending') await new Promise(resolve => { release = resolve; });
  const payload = mode === 'empty' ? empty : fixture;
  if (mode === 'failure') return route.fulfill({ status: 502, json: { error: 'Test refresh failure.' } });
  if (mode === 'malformed') return route.fulfill({ json: { ...fixture, excuseRecords: null } });
  return route.fulfill({ json: payload });
});
const authUser = {
  localId: 'weekly-usage-ui-test', email: 'spoolappteam@gmail.com', emailVerified: true,
  displayName: 'Visual test admin', createdAt: String(now), lastLoginAt: String(now),
  providerUserInfo: [{ providerId: 'google.com', rawId: 'weekly-usage-ui-test', email: 'spoolappteam@gmail.com' }],
};
await page.route('https://identitytoolkit.googleapis.com/**', route => route.fulfill({ json: { users: [authUser] } }));

async function signInFixture(uid = 'weekly-usage-ui-test') {
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = `${encoded({ alg: 'none' })}.${encoded({ sub: uid, user_id: uid, email: authUser.email, email_verified: true, aud: firebaseConfig.projectId, iss: `https://securetoken.google.com/${firebaseConfig.projectId}`, exp: Math.floor(now / 1000) + 3600, iat: Math.floor(now / 1000), auth_time: Math.floor(now / 1000), firebase: { sign_in_provider: 'google.com' } })}.test-only`;
  await page.evaluate(async ({ uid, token, config, authUser, now }) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('firebaseLocalStorageDb', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('firebaseLocalStorage', 'readwrite');
      transaction.objectStore('firebaseLocalStorage').put({
        fbase_key: `firebase:authUser:${config.apiKey}:[DEFAULT]`,
        value: { uid, displayName: authUser.displayName, email: authUser.email, emailVerified: true, isAnonymous: false,
          providerData: [{ providerId: 'google.com', uid, email: authUser.email, displayName: authUser.displayName }],
          stsTokenManager: { refreshToken: 'test-only', accessToken: token, expirationTime: now + 3600000 },
          createdAt: String(now), lastLoginAt: String(now), apiKey: config.apiKey, appName: '[DEFAULT]' },
      });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  }, { uid, token, config: firebaseConfig, authUser, now });
  await page.reload();
}

try {
  // These requests hit the actual Next.js route, outside the page's response fixtures.
  assert.equal((await context.request.get(`${base}/api/analytics/weekly-usage`)).status(), 401);
  assert.equal((await context.request.get(`${base}/api/analytics/weekly-usage`, { headers: { Authorization: 'Bearer invalid-token' } })).status(), 401);
  await page.goto(`${base}/analytics?tab=weekly-usage`);
  await page.getByText('Sign in with an authorized Google account').waitFor();
  assert.equal(await page.getByRole('table').count(), 0);
  await signInFixture();
  await page.getByRole('heading', { name: 'Weekly Usage', exact: true }).waitFor();
  await page.getByRole('table').waitFor();
  await page.getByRole('button', { name: 'Refresh data', exact: true }).waitFor();
  assert.equal(calls, 1);
  assert.equal(await page.locator('.filters').count(), 0);
  assert.equal(await page.getByRole('img', { name: /Average requested/ }).count(), 1);
  assert.ok((await page.locator('.weekly-primary-row').innerText()).includes(String(fixture.cohorts[1].users)));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
  await page.locator('.weekly-method summary').click();
  await page.getByText('Weeks start on the UTC calendar day', { exact: false }).waitFor();
  await page.locator('.weekly-method summary').click();

  const cachedStart = performance.now();
  await page.getByRole('button', { name: 'Releases', exact: true }).click();
  await page.getByRole('button', { name: 'Weekly Usage', exact: true }).click();
  await page.waitForURL(/tab=weekly-usage/);
  await page.getByRole('table').waitFor();
  assert.equal(calls, 1, 'cached tab revisit must not query the backend');
  const cachedVisitMs = Math.round(performance.now() - cachedStart);
  await page.reload();
  await page.getByRole('table').waitFor();
  assert.equal(calls, 1, 'session cache must survive a page reload');

  mode = 'pending';
  await page.getByRole('button', { name: 'Refresh data', exact: true }).click();
  await page.getByRole('button', { name: 'Refreshing…', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Refreshing…', exact: true }).isDisabled());
  assert.equal(await page.getByRole('table').count(), 1, 'refresh must not blank the report');
  await page.waitForFunction(() => document.querySelector('.weekly-refresh button')?.disabled);
  const deadline = Date.now() + 10000;
  while (!release && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
  assert.ok(release, 'refresh request must reach the endpoint');
  mode = 'failure'; release();
  await page.locator('.weekly-usage').getByRole('alert').waitFor();
  assert.ok(lastRefresh, 'manual refresh must force a fresh backend snapshot');
  assert.ok((await page.locator('.weekly-usage').getByRole('alert').innerText()).includes('last successful report'));
  assert.equal(await page.getByRole('table').count(), 1);
  await page.screenshot({ path: path.join(output, 'refresh-failure.png'), fullPage: true });

  mode = 'success';
  fixture.generatedAt = new Date(now + 1000).toISOString();
  await page.getByRole('button', { name: 'Refresh data', exact: true }).click();
  await page.getByRole('button', { name: 'Refresh data', exact: true }).waitFor();
  assert.equal(await page.locator('.weekly-usage').getByRole('alert').count(), 0);
  assert.ok((await page.locator('.weekly-refresh [role="status"]').innerText()).includes(new Date(fixture.generatedAt).toLocaleString()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile viewport must not overflow');
  assert.ok(await page.locator('.weekly-table-scroll').evaluate(el => el.scrollWidth > el.clientWidth), 'table should scroll inside its container');

  mode = 'empty';
  await page.getByRole('button', { name: 'Refresh data', exact: true }).click();
  await page.getByText('No users have three completed weeks', { exact: false }).waitFor();
  assert.equal(await page.locator('canvas').count(), 0);
  assert.ok((await page.locator('.weekly-primary-row').innerText()).includes('—'));
  await page.screenshot({ path: path.join(output, 'empty.png'), fullPage: true });

  // Corrupt stored JSON must recover rather than break the dashboard.
  await page.evaluate(() => {
    const key = Object.keys(sessionStorage).find(k => k.startsWith('spool-weekly-usage'));
    sessionStorage.setItem(key, 'not valid json');
  });
  mode = 'success';
  await page.reload();
  await page.getByRole('img', { name: /Average requested/ }).waitFor();
  mode = 'malformed';
  await page.getByRole('button', { name: 'Refresh data', exact: true }).click();
  await page.getByText('The report was incomplete.', { exact: false }).waitFor();
  assert.equal(await page.getByRole('table').count(), 1);

  const beforeStaleReload = calls;
  await page.evaluate(() => {
    const key = Object.keys(sessionStorage).find(k => k.startsWith('spool-weekly-usage'));
    const cached = JSON.parse(sessionStorage.getItem(key));
    cached.generatedAt = '2020-01-01T00:00:00Z';
    sessionStorage.setItem(key, JSON.stringify(cached));
  });
  mode = 'success';
  await page.reload();
  await page.getByRole('button', { name: 'Refresh data', exact: true }).waitFor();
  assert.equal(calls, beforeStaleReload + 1, 'stale session cache must refresh automatically');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, apiCalls: calls, cachedVisitMs, screenshots: output,
    checks: ['real route rejects absent/invalid tokens', 'signed-out gate', 'desktop chart/table', 'full-history scope', 'cache revisit/reload', 'manual refresh/new timestamp', 'pending state', 'stale report on failure', 'retry recovery', 'mobile overflow', 'empty cohort', 'corrupt cache recovery', 'malformed response rejection', 'automatic stale refresh', 'no browser exceptions'] }, null, 2));
} catch (error) {
  await page.screenshot({ path: path.join(output, 'test-failure.png'), fullPage: true });
  console.error('Browser failure context:', { url: page.url(), calls, errors });
  throw error;
} finally {
  await browser.close();
}
