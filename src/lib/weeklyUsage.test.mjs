import test from 'node:test';
import assert from 'node:assert/strict';
import { computeWeeklyUsage } from './weeklyUsage.mjs';
import { TEAM_USER_IDS } from './analyticsAccess.mjs';

const START = Date.parse('2026-09-01T00:00:00Z');
const DAY = 86400000;
const asOf = START + 22 * DAY;
const event = (userId, day, durationMinutes = 7) => ({ userId, timestamp: START + day * DAY, durationMinutes });
const history = (userId, days = 3, weeklyMinutes = [70, 35, 14]) => weeklyMinutes.flatMap((minutes, w) =>
  Array.from({ length: days }, (_, d) => event(userId, w * 7 + d, minutes)));

test('paired cohorts use fixed users and seven calendar days, not active days', () => {
  const report = computeWeeklyUsage({ users: [], excuses: [...history('a'), ...history('b', 1), ...history('c', 5)], asOf });
  assert.deepEqual(report.cohorts.map(c => c.users), [3, 2, 1]);
  const engaged = report.cohorts[1];
  assert.deepEqual(engaged.weeks.map(w => w.meanMinutes), [40, 20, 8]);
  assert.deepEqual(engaged.weeks.map(w => w.changePercent), [0, -50, -80]);
  assert.equal(engaged.weeks[2].usersDecreased, 2);
  assert.equal(engaged.weeks[2].changeMinutes, -32);
});

test('exclude inactive, team, sandbox and incomplete or invalid-duration users', () => {
  const excuses = [...history('good'), ...history('missing'), ...history('sandbox'), ...history(TEAM_USER_IDS[0]), ...history('string'), ...history('zero')];
  excuses.find(e => e.userId === 'missing').durationMinutes = null;
  excuses.find(e => e.userId === 'string').durationMinutes = '7';
  excuses.find(e => e.userId === 'zero').durationMinutes = 0;
  const report = computeWeeklyUsage({ users: [{ id: 'sandbox', subscriptionEnvironment: 'sandbox' }, { id: 'download-only' }], excuses, asOf });
  assert.equal(report.cohorts[1].users, 1);
  assert.equal(report.cohorts[1].missingDurationUsers, 3);
  assert.equal(report.cohorts[1].activeUsers, 4);
  assert.equal(report.activeUsers, 4);
});

test('UTC boundaries, observation cutoff, and an unfinished third week', () => {
  const excuses = [event('a', 0), event('a', 7 - 1 / DAY), event('a', 7, 14), event('a', 14, 21)];
  assert.deepEqual(computeWeeklyUsage({ users: [], excuses, asOf: START + 21 * DAY }).cohorts[0].weeks.map(w => w.meanMinutes), [2, 2, 3]);
  assert.equal(computeWeeklyUsage({ users: [], excuses, asOf: START + 21 * DAY - 1 }).cohorts[0].users, 0);
});

test('missing activity is not zero; first-ever excuse anchors tenure', () => {
  const excuses = [...history('retained'), ...history('dropout').filter(e => e.timestamp < START + 14 * DAY), ...history('older'), event('older', -100, null)];
  const report = computeWeeklyUsage({ users: [], excuses, asOf });
  assert.equal(report.cohorts[1].users, 1);
  assert.equal(report.cohorts[1].weeks[2].meanMinutes, 6);
});

test('invalid/future timestamps exclude the whole account; bad durations outside the first 3 weeks do not', () => {
  const excuses = [...history('invalid'), ...history('future'), ...history('valid'),
    { userId: 'invalid', timestamp: null, durationMinutes: 5 }, event('future', 30), event('valid', 21, null)];
  const report = computeWeeklyUsage({ users: [], excuses, asOf });
  assert.equal(report.invalidTimestampUsers, 2);
  assert.equal(report.cohorts[1].users, 1);
});

test('empty results are null instead of fabricated zero reductions; identical paired changes have exact intervals', () => {
  const empty = computeWeeklyUsage({ users: [], excuses: [], asOf });
  assert.equal(empty.cohorts[1].weeks[2].meanMinutes, null);
  assert.equal(empty.cohorts[1].weeks[2].changePercent, null);
  assert.equal(empty.cohorts[1].weeks[2].changeInterval, null);
  const report = computeWeeklyUsage({ users: [], excuses: [...history('a'), ...history('b')], asOf });
  assert.deepEqual(report.cohorts[1].weeks[2].changeInterval, [-24, -24]);
  assert.throws(() => computeWeeklyUsage({ users: [], excuses: [], asOf: 'invalid' }));
});

test('30,000 records calculate within two seconds and never expose identifiers', () => {
  const excuses = Array.from({ length: 1000 }, (_, i) => Array.from({ length: 30 }, (_, day) => event(`private-user-${i}`, day, 15))).flat();
  const started = performance.now();
  const report = computeWeeklyUsage({ users: [], excuses, asOf: START + 31 * DAY });
  assert.equal(report.cohorts[2].users, 1000);
  assert.ok(performance.now() - started < 2000);
  assert.ok(!JSON.stringify(report).includes('private-user-'));
});
