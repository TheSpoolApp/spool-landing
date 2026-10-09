import { firebaseConfig } from '../config/firebaseConfig.mjs';
import { DASHBOARD_EMAILS } from './analyticsAccess.mjs';
import { computeWeeklyUsage, WEEKLY_USAGE_CACHE_MS } from './weeklyUsage.mjs';

const DATABASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

async function query(fetchImpl, token, collectionId, fields, readTime) {
  const response = await fetchImpl(`${DATABASE}:runQuery`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId, allDescendants: collectionId === 'excuses' }],
        select: { fields: fields.map(fieldPath => ({ fieldPath })) },
      },
      readTime,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(35000),
  });
  if (!response.ok) throw new Error('Firestore read failed.');
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.some(row => row.error)) throw new Error('Incomplete Firestore response.');
  return rows.flatMap(row => row.document ? [row.document] : []);
}

export async function readWeeklyUsageData(token, readTime, fetchImpl = fetch) {
  // Two projected reads at the same snapshot; no excuse text, email, or per-user round trips.
  const [userDocs, excuseDocs] = await Promise.all([
    query(fetchImpl, token, 'users', ['subscriptionEnvironment'], readTime),
    query(fetchImpl, token, 'excuses', ['timestamp', 'createdAt', 'durationMinutes'], readTime),
  ]);
  return {
    users: userDocs.map(doc => ({
      id: doc.name.split('/').at(-1),
      subscriptionEnvironment: doc.fields?.subscriptionEnvironment?.stringValue,
    })),
    excuses: excuseDocs.flatMap(doc => {
      const path = doc.name.split('/documents/')[1];
      const match = /^users\/([^/]+)\/excuses\/[^/]+$/.exec(path);
      if (!match) return [];
      const fields = doc.fields || {};
      const minutes = fields.durationMinutes?.integerValue ?? fields.durationMinutes?.doubleValue;
      return [{
        userId: match[1],
        timestamp: fields.timestamp?.timestampValue ?? fields.createdAt?.timestampValue,
        durationMinutes: minutes == null ? null : Number(minutes),
      }];
    }),
  };
}

export function createWeeklyUsageHandler({ fetchImpl = fetch, now = Date.now } = {}) {
  // shortcut: warm-process cache only, use a durable aggregate cache if cold reads become slow.
  let cachedReport = null;
  let inFlight = null;
  const reply = (body, status = 200) => Response.json(body, {
    status, headers: { 'Cache-Control': 'private, no-store' },
  });

  return async function GET(request) {
    const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
    if (!token) return reply({ error: 'Sign in to view weekly usage.' }, 401);
    try {
      // Verify with Firebase before serving even a cached report. No admin key or token cache.
      const auth = await fetchImpl(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }), cache: 'no-store', signal: AbortSignal.timeout(8000),
      });
      if (!auth.ok) {
        const invalidSession = auth.status === 400 || auth.status === 401;
        return reply({ error: invalidSession ? 'Your session expired. Sign in again.' : 'Authentication is temporarily unavailable. Please try again.' }, invalidSession ? 401 : 502);
      }
      const identity = (await auth.json()).users?.[0];
      if (!identity?.localId || identity.disabled || !identity.emailVerified || !DASHBOARD_EMAILS.includes(identity.email?.toLowerCase())) {
        return reply({ error: 'This account is not authorized for the dashboard.' }, 403);
      }

      const refresh = new URL(request.url).searchParams.get('refresh') === '1';
      if (!refresh && cachedReport && now() - Date.parse(cachedReport.generatedAt) < WEEKLY_USAGE_CACHE_MS) {
        return reply(cachedReport);
      }
      if (!inFlight) {
        const readTime = new Date(now()).toISOString();
        inFlight = readWeeklyUsageData(token, readTime, fetchImpl)
          .then(data => {
            const report = computeWeeklyUsage({ ...data, asOf: readTime });
            cachedReport = report;
            return report;
          }).finally(() => { inFlight = null; });
      }
      return reply(await inFlight);
    } catch {
      return reply({ error: 'Weekly usage could not be refreshed. Please try again.' }, 502);
    }
  };
}
