import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeeklyUsageHandler, readWeeklyUsageData } from './weeklyUsageServer.mjs';
import { WEEKLY_USAGE_CACHE_MS } from './weeklyUsage.mjs';

const readTime = '2026-10-09T12:00:00.000Z';
const prefix = 'projects/spool-a5020/databases/(default)/documents/';
const request = (refresh = false, token = 'test-token') => new Request(`http://localhost/api/analytics/weekly-usage${refresh ? '?refresh=1' : ''}`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

function fixture() {
  const state = { authStatus: 200, email: 'spoolappteam@gmail.com', verified: true, disabled: false, reads: 0, authCalls: 0, fail: false, time: Date.parse(readTime), hold: null };
  const fetchImpl = async (url, options) => {
    assert.equal(options.cache, 'no-store');
    if (url.includes('accounts:lookup')) {
      state.authCalls++;
      assert.deepEqual(JSON.parse(options.body), { idToken: 'test-token' });
      return Response.json({ users: [{ localId: 'admin', email: state.email, emailVerified: state.verified, disabled: state.disabled }] }, { status: state.authStatus });
    }
    state.reads++;
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    const query = JSON.parse(options.body);
    assert.equal(query.readTime, new Date(state.time).toISOString());
    if (state.hold) await state.hold;
    if (state.fail) return Response.json({ error: 'private upstream error' }, { status: 503 });
    const collection = query.structuredQuery.from[0].collectionId;
    const fields = query.structuredQuery.select.fields.map(f => f.fieldPath);
    if (collection === 'users') {
      assert.deepEqual(fields, ['subscriptionEnvironment']);
      return Response.json([{ document: { name: `${prefix}users/member`, fields: { subscriptionEnvironment: { stringValue: 'production' } } } }]);
    }
    assert.deepEqual(fields, ['timestamp', 'createdAt', 'durationMinutes']);
    return Response.json([0, 7, 14].map((day, i) => ({ document: {
      name: `${prefix}users/member/excuses/e${i}`,
      fields: { timestamp: { timestampValue: new Date(Date.parse('2026-09-01') + day * 86400000).toISOString() }, durationMinutes: { integerValue: '14' } },
    } })));
  };
  return { state, fetchImpl, handle: createWeeklyUsageHandler({ fetchImpl, now: () => state.time }) };
}

test('server authenticates before cache access and rejects unauthorized/unverified/disabled users', async () => {
  const { state, handle } = fixture();
  assert.equal((await handle(request(false, null))).status, 401);
  assert.equal(state.authCalls, 0);
  state.authStatus = 400;
  assert.equal((await handle(request())).status, 401);
  state.authStatus = 200;
  state.email = 'stranger@example.com';
  assert.equal((await handle(request())).status, 403);
  state.email = 'spoolappteam@gmail.com'; state.verified = false;
  assert.equal((await handle(request())).status, 403);
  state.verified = true; state.disabled = true;
  assert.equal((await handle(request())).status, 403);
  assert.equal(state.reads, 0);
  state.disabled = false;
  assert.equal((await handle(request())).status, 200);
  state.email = 'stranger@example.com';
  assert.equal((await handle(request())).status, 403);
  assert.equal(state.reads, 2);
});

test('two projected snapshot reads, fast cache reuse, explicit refresh and TTL expiry', async () => {
  const { state, handle } = fixture();
  const response = await handle(request());
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  const report = await response.json();
  assert.equal(report.cohorts[0].users, 1);
  assert.deepEqual(report.cohorts[0].weeks.map(w => w.meanMinutes), [2, 2, 2]);
  assert.equal(state.reads, 2);
  assert.ok(!JSON.stringify(report).includes('member'));
  await handle(request());
  assert.equal(state.reads, 2);
  await handle(request(true));
  assert.equal(state.reads, 4);
  state.time += WEEKLY_USAGE_CACHE_MS;
  await handle(request());
  assert.equal(state.reads, 6);
});

test('authentication throttling and outages are retryable, not expired sessions', async () => {
  const { state, handle } = fixture();
  for (const status of [429, 503]) {
    state.authStatus = status;
    const response = await handle(request());
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /temporarily unavailable/);
  }
  assert.equal(state.reads, 0);
});

test('concurrent refreshes share one database read and recover after failure without replacing cached data', async () => {
  const { state, handle } = fixture();
  const first = await (await handle(request())).json();
  let release;
  state.hold = new Promise(resolve => { release = resolve; });
  const a = handle(request(true));
  const b = handle(request(true));
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(state.reads, 4);
  release();
  assert.equal((await a).status, 200);
  assert.equal((await b).status, 200);
  state.hold = null; state.fail = true;
  const failed = await handle(request(true));
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.text()).includes('private upstream error'));
  assert.deepEqual(await (await handle(request())).json(), first);
  state.fail = false;
  assert.equal((await handle(request(true))).status, 200);
});

test('transport timeout and partial Firestore errors fail closed', async () => {
  const { fetchImpl } = fixture();
  for (const mode of ['throw', 'partial', 'malformed']) {
    const handle = createWeeklyUsageHandler({ now: () => Date.parse(readTime), fetchImpl: async (url, options) => {
      if (url.includes('accounts:lookup')) return fetchImpl(url, options);
      if (mode === 'throw') throw new DOMException('timeout', 'TimeoutError');
      return Response.json(mode === 'partial' ? [{ error: { message: 'bad' } }] : {});
    } });
    assert.equal((await handle(request())).status, 502);
  }
});

test('REST decoding preserves absent minutes, createdAt fallback and rejects unrelated collection-group paths', async () => {
  const data = await readWeeklyUsageData('token', readTime, async (url, options) => {
    if (JSON.parse(options.body).structuredQuery.from[0].collectionId === 'users') return Response.json([{ readTime }]);
    return Response.json([
      { document: { name: `${prefix}users/a/excuses/1`, fields: { createdAt: { timestampValue: readTime }, durationMinutes: { doubleValue: 2.5 } } } },
      { document: { name: `${prefix}users/a/excuses/2`, fields: {} } },
      { document: { name: `${prefix}other/a/excuses/3`, fields: {} } },
    ]);
  });
  assert.equal(data.excuses.length, 2);
  assert.equal(data.excuses[0].timestamp, readTime);
  assert.equal(data.excuses[0].durationMinutes, 2.5);
  assert.equal(data.excuses[1].durationMinutes, null);
});
