import { median, toMillis } from './analyticsMetrics.mjs';
import { TEAM_USER_IDS } from './analyticsAccess.mjs';

const DAY = 86400000;
export const WEEKLY_USAGE_CACHE_MS = 5 * 60 * 1000;
export const WEEKLY_USAGE_VERSION = 1;
const mean = values => values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : null;
const validMinutes = value => typeof value === 'number' && Number.isFinite(value) && value > 0;

function pairedInterval(changes) {
  if (!changes.length) return null;
  // Resample people (not events) to preserve paired observations; seed keeps refreshes reproducible.
  let seed = 20261009;
  const samples = Array.from({ length: 2000 }, () => {
    let sum = 0;
    for (let i = 0; i < changes.length; i++) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      sum += changes[Math.floor((seed >>> 0) / 4294967296 * changes.length)];
    }
    return sum / changes.length;
  }).sort((a, b) => a - b);
  return [samples[49], samples[1949]];
}

export function computeWeeklyUsage({ users, excuses, asOf }) {
  const now = toMillis(asOf);
  if (!Number.isFinite(now)) throw new Error('A valid observation date is required.');
  const cutoff = Math.floor(now / DAY) * DAY;
  const excludedIds = new Set(TEAM_USER_IDS);
  for (const user of users) {
    if (user.subscriptionEnvironment === 'sandbox') excludedIds.add(user.id);
  }

  const byUser = new Map();
  let excludedEvents = 0;
  let invalidTimestampEvents = 0;
  let validDurationEvents = 0;
  for (const event of excuses) {
    if (excludedIds.has(event.userId)) { excludedEvents++; continue; }
    if (!event.userId) continue;
    if (!byUser.has(event.userId)) byUser.set(event.userId, { first: Infinity, events: [], invalid: false });
    const row = byUser.get(event.userId);
    const time = toMillis(event.timestamp);
    if (!Number.isFinite(time) || time > now) {
      row.invalid = true;
      invalidTimestampEvents++;
      continue;
    }
    row.first = Math.min(row.first, Math.floor(time / DAY) * DAY);
    row.events.push({ time, minutes: event.durationMinutes });
    if (validMinutes(event.durationMinutes)) validDurationEvents++;
  }

  const eligible = [];
  let invalidTimestampUsers = 0;
  for (const row of byUser.values()) {
    if (row.invalid) { invalidTimestampUsers++; continue; }
    if (row.first + 21 * DAY > cutoff) continue;
    const weeks = Array.from({ length: 3 }, () => ({ days: new Set(), minutes: 0, missing: false }));
    for (const event of row.events) {
      const week = Math.floor((event.time - row.first) / (7 * DAY));
      if (week >= 3) continue;
      const bucket = weeks[week];
      bucket.days.add(Math.floor(event.time / DAY));
      if (validMinutes(event.minutes)) bucket.minutes += event.minutes;
      else bucket.missing = true;
    }
    eligible.push(weeks);
  }

  const cohorts = [1, 3, 5].map(minActiveDays => {
    const active = eligible.filter(weeks => weeks.every(w => w.days.size >= minActiveDays));
    const complete = active.filter(weeks => weeks.every(w => !w.missing));
    const baseline = complete.map(weeks => weeks[0].minutes / 7);
    return {
      minActiveDays,
      users: complete.length,
      activeUsers: active.length,
      missingDurationUsers: active.length - complete.length,
      weeks: [0, 1, 2].map(week => {
        const values = complete.map(weeks => weeks[week].minutes / 7);
        const changes = values.map((value, index) => value - baseline[index]);
        const average = mean(values);
        return {
          week: week + 1,
          meanMinutes: average,
          medianMinutes: median(values),
          changeMinutes: mean(changes),
          changePercent: complete.length ? (average / mean(baseline) - 1) * 100 : null,
          usersDecreased: changes.filter(value => value < 0).length,
          changeInterval: week === 0 ? (complete.length ? [0, 0] : null) : pairedInterval(changes),
        };
      }),
    };
  });

  return {
    version: WEEKLY_USAGE_VERSION,
    generatedAt: new Date(now).toISOString(),
    observationCutoff: new Date(cutoff).toISOString(),
    accountDocuments: users.length,
    excuseRecords: excuses.length,
    validDurationEvents,
    excludedEvents,
    activeUsers: byUser.size,
    eligibleUsers: eligible.length,
    invalidTimestampEvents,
    invalidTimestampUsers,
    cohorts,
  };
}
