"use client";
import { summarizeMinutesBySubscription } from '../lib/analyticsMetrics.mjs';
import { TEAM_USER_IDS } from '../lib/analyticsAccess.mjs';
export { TEAM_USER_IDS } from '../lib/analyticsAccess.mjs';
// Pure computation functions for Excuse Data dashboard.
// No React, no side effects. Called from useMemo hooks.

/**
 * Compute text diversity per user.
 * @param {Object} excusesByUser - { userId: [excuse, ...] }
 * @returns {{ [userId]: { total: number, unique: number, diversityPct: number } }}
 */
export function computeTextDiversity(excusesByUser) {
  const result = {};
  for (const [userId, excs] of Object.entries(excusesByUser)) {
    const total = excs.length;
    const unique = new Set(excs.map(e => (e.text || '').trim().toLowerCase())).size;
    result[userId] = { total, unique, diversityPct: total > 0 ? unique / total : 0 };
  }
  return result;
}

/**
 * Compute longest and current streak per user.
 * @param {Object} excusesByUser - { userId: [excuse, ...] } (excuses must have .date)
 * @returns {{ [userId]: { longest: number, current: number, uniqueDays: number } }}
 */
export function computeStreaks(excusesByUser) {
  const result = {};
  for (const [userId, excs] of Object.entries(excusesByUser)) {
    const dayStrs = [...new Set(
      excs.filter(e => e.date).map(e => e.date.toISOString().split('T')[0])
    )].sort();

    if (dayStrs.length === 0) {
      result[userId] = { longest: 0, current: 0, uniqueDays: 0 };
      continue;
    }

    let longest = 1, cur = 1, current = 1;
    for (let i = 1; i < dayStrs.length; i++) {
      const prev = new Date(dayStrs[i - 1]);
      const next = new Date(dayStrs[i]);
      const diff = (next - prev) / 86400000;
      if (diff === 1) {
        cur++;
        if (cur > longest) longest = cur;
      } else {
        cur = 1;
      }
    }
    // Current streak: count from the end
    current = 1;
    for (let i = dayStrs.length - 1; i > 0; i--) {
      const curr = new Date(dayStrs[i]);
      const prev = new Date(dayStrs[i - 1]);
      if ((curr - prev) / 86400000 === 1) {
        current++;
      } else {
        break;
      }
    }

    result[userId] = { longest, current, uniqueDays: dayStrs.length };
  }
  return result;
}

/**
 * Filter user IDs based on diversity threshold and team exclusion.
 * @param {string[]} allUserIds
 * @param {Object} diversityMap - from computeTextDiversity
 * @param {number} minDiversity - 0-1, default 0.5
 * @param {boolean} excludeTeam
 * @returns {Set<string>}
 */
export function filterUsers(allUserIds, diversityMap, minDiversity = 0.5, excludeTeam = true) {
  return new Set(allUserIds.filter(uid => {
    if (excludeTeam && TEAM_USER_IDS.includes(uid)) return false;
    const div = diversityMap[uid];
    if (!div) return false;
    return div.diversityPct >= minDiversity;
  }));
}

/**
 * Compute habit formation data: % of users still active at each week-of-usage.
 * @param {Array} excuses - full excuse list with .userId, .date
 * @param {Set<string>} filteredUserIds
 * @param {number} powerUserThreshold - min excuses to be "power user"
 * @returns {{ weekLabels: number[], pctAll: number[], pctPower: number[] }}
 */
export function computeHabitFormation(excuses, filteredUserIds, powerUserThreshold = 50) {
  // Group excuses by user (filtered only)
  const byUser = {};
  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!byUser[e.userId]) byUser[e.userId] = [];
    byUser[e.userId].push(e);
  }

  // Find global last date across all users (observation window end)
  let globalLastDate = null;
  for (const excs of Object.values(byUser)) {
    for (const e of excs) {
      if (!globalLastDate || e.date > globalLastDate) globalLastDate = e.date;
    }
  }
  if (!globalLastDate) return { weekLabels: [], pctAll: [], pctPower: [] };

  // For each user, find first excuse date, active weeks, and tenure (weeks since join to observation end)
  const userActiveWeeks = {}; // { userId: Set<weekNum> }
  const userTenureWeek = {}; // { userId: max observable week based on tenure }
  const userCounts = {}; // { userId: totalCount }
  for (const [userId, excs] of Object.entries(byUser)) {
    excs.sort((a, b) => a.date - b.date);
    const first = excs[0].date;
    userCounts[userId] = excs.length;
    userActiveWeeks[userId] = new Set();
    for (const e of excs) {
      const week = Math.floor((e.date - first) / (7 * 86400000));
      userActiveWeeks[userId].add(week);
    }
    // Tenure: how many weeks from first entry to global observation end
    userTenureWeek[userId] = Math.floor((globalLastDate - first) / (7 * 86400000));
  }

  // Find max tenure across all users
  let maxWeek = 0;
  for (const tw of Object.values(userTenureWeek)) {
    if (tw > maxWeek) maxWeek = tw;
  }

  const allUserIds = Object.keys(userActiveWeeks);
  const powerUserIds = allUserIds.filter(uid => userCounts[uid] >= powerUserThreshold);

  const weekLabels = [];
  const pctAll = [];
  const pctPower = [];
  const eligibleCounts = [];

  for (let w = 0; w <= maxWeek; w++) {
    // Eligible: users whose tenure (time since join) covers this week
    const allEligible = allUserIds.filter(uid => userTenureWeek[uid] >= w);
    const powerEligible = powerUserIds.filter(uid => userTenureWeek[uid] >= w);

    if (allEligible.length < 3) continue;

    const allActive = allEligible.filter(uid => userActiveWeeks[uid].has(w)).length;
    const powerActive = powerEligible.filter(uid => userActiveWeeks[uid].has(w)).length;

    weekLabels.push(w);
    pctAll.push(allEligible.length > 0 ? (allActive / allEligible.length) * 100 : 0);
    pctPower.push(powerEligible.length > 0 ? (powerActive / powerEligible.length) * 100 : 0);
    eligibleCounts.push(allEligible.length);
  }

  return { weekLabels, pctAll, pctPower, eligibleCounts };
}

/**
 * Compute cohort retention.
 * @param {Array} excuses
 * @param {Set<string>} filteredUserIds
 * @returns {{ cohorts: Array<{ label: string, size: number, retention: Object<number, number> }> }}
 */
export function computeCohortRetention(excuses, filteredUserIds) {
  const WEEK_CHECKPOINTS = [0, 1, 2, 4, 8, 12];

  // Group by user → find first excuse date + active weeks
  const userFirst = {}; // userId → Date
  const userActiveWeeks = {}; // userId → Set<weekNum since first excuse>

  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!userFirst[e.userId] || e.date < userFirst[e.userId]) {
      userFirst[e.userId] = e.date;
    }
  }

  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    const first = userFirst[e.userId];
    const week = Math.floor((e.date - first) / (7 * 86400000));
    if (!userActiveWeeks[e.userId]) userActiveWeeks[e.userId] = new Set();
    userActiveWeeks[e.userId].add(week);
  }

  // Group users by cohort month
  const cohortUsers = {}; // "2025-12" → [userId, ...]
  for (const [userId, first] of Object.entries(userFirst)) {
    const label = `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, '0')}`;
    if (!cohortUsers[label]) cohortUsers[label] = [];
    cohortUsers[label].push(userId);
  }

  const cohorts = Object.entries(cohortUsers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, userIds]) => {
      const size = userIds.length;
      const retention = {};
      for (const w of WEEK_CHECKPOINTS) {
        const active = userIds.filter(uid => userActiveWeeks[uid]?.has(w)).length;
        retention[w] = size > 0 ? active / size : 0;
      }
      // Format label: "2025-12" → "Dec 2025"
      const [y, m] = label.split('-');
      const monthName = new Date(Number(y), Number(m) - 1).toLocaleString('en-US', { month: 'short' });
      return { label: `${monthName} ${y}`, size, retention };
    });

  return { cohorts, weekCheckpoints: WEEK_CHECKPOINTS };
}

/**
 * Compute category shift: first half vs second half of each user's usage.
 * Returns top categories with their % in early vs late usage.
 * @param {Array} excuses
 * @param {Set<string>} filteredUserIds
 * @param {string[]} categories
 * @returns {{ categories: Array<{ name: string, earlyPct: number, latePct: number, delta: number }>, earlySample: number, lateSample: number }}
 */
export function computeCategoryEvolution(excuses, filteredUserIds, categories) {
  // Find each user's first excuse date and total span
  const userFirst = {};
  const userLast = {};
  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!userFirst[e.userId] || e.date < userFirst[e.userId]) userFirst[e.userId] = e.date;
    if (!userLast[e.userId] || e.date > userLast[e.userId]) userLast[e.userId] = e.date;
  }

  // Split each user's categorized excuses into early half vs late half by their midpoint
  const earlyCounts = {};
  const lateCounts = {};
  categories.forEach(c => { earlyCounts[c] = 0; lateCounts[c] = 0; });
  let earlyTotal = 0, lateTotal = 0;

  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!e.category || !categories.includes(e.category)) continue;
    const first = userFirst[e.userId];
    const last = userLast[e.userId];
    if (!first || !last) continue;
    const span = last - first;
    if (span < 7 * 86400000) continue; // skip users with less than 1 week of data
    const midpoint = new Date(first.getTime() + span / 2);
    if (e.date < midpoint) {
      earlyCounts[e.category]++;
      earlyTotal++;
    } else {
      lateCounts[e.category]++;
      lateTotal++;
    }
  }

  // Compute metadata for footnotes
  let usersIncluded = 0;
  let usersExcludedShortSpan = 0;
  let uncategorizedCount = 0;
  let earliestDate = null, latestDate = null;
  const includedUserIds = new Set();

  for (const uid of filteredUserIds) {
    const first = userFirst[uid], last = userLast[uid];
    if (!first || !last) continue;
    const span = last - first;
    if (span < 7 * 86400000) { usersExcludedShortSpan++; continue; }
    usersIncluded++;
    includedUserIds.add(uid);
    if (!earliestDate || first < earliestDate) earliestDate = first;
    if (!latestDate || last > latestDate) latestDate = last;
  }

  // Count uncategorized excuses among included users
  for (const e of excuses) {
    if (!includedUserIds.has(e.userId)) continue;
    if (!e.category || !categories.includes(e.category)) uncategorizedCount++;
  }

  if (earlyTotal === 0 || lateTotal === 0) return { categories: [], earlySample: 0, lateSample: 0, usersIncluded: 0, usersExcludedShortSpan: 0, uncategorizedCount: 0, earliestDate: null, latestDate: null };

  // Compute percentages and deltas, filter to categories with meaningful presence
  const result = categories
    .map(name => {
      const earlyPct = (earlyCounts[name] / earlyTotal) * 100;
      const latePct = (lateCounts[name] / lateTotal) * 100;
      return { name, earlyPct, latePct, delta: latePct - earlyPct };
    })
    .filter(c => c.earlyPct >= 3 || c.latePct >= 3) // only categories with 3%+ presence
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)); // biggest movers first

  return { categories: result, earlySample: earlyTotal, lateSample: lateTotal, usersIncluded, usersExcludedShortSpan, uncategorizedCount, earliestDate, latestDate };
}

/**
 * Compute ICP segments: for each category, find users where that category is 25%+
 * of their excuses, compute segment stats vs general population.
 * @param {Array} excuses
 * @param {Set<string>} filteredUserIds
 * @param {string[]} categories
 * @param {Object} streakMap - from computeStreaks
 * @param {Object} excusesByUser - { userId: [excuse, ...] }
 * @returns {Array<{ category, earlyPct, latePct, delta, segmentUserIds, segmentSize, segmentAvgStreak, popAvgStreak, segmentRetention, popRetention, segmentAvgEntries, popAvgEntries, retentionDelta }>}
 */
export function computeICPSegments(excuses, filteredUserIds, categories, streakMap, excusesByUser) {
  const now = new Date();
  const FOURTEEN_DAYS = 14 * 86400000;

  // General population stats
  const popIds = [...filteredUserIds];
  let popStreakSum = 0, popEntrySum = 0, popRetainedCount = 0;
  popIds.forEach(uid => {
    popStreakSum += (streakMap[uid]?.longest || 0);
    popEntrySum += (excusesByUser[uid]?.length || 0);
    const excs = excusesByUser[uid] || [];
    const lastDate = excs.reduce((max, e) => e.date && (!max || e.date > max) ? e.date : max, null);
    if (lastDate && (now - lastDate) <= FOURTEEN_DAYS) popRetainedCount++;
  });
  const popAvgStreak = popIds.length > 0 ? popStreakSum / popIds.length : 0;
  const popAvgEntries = popIds.length > 0 ? popEntrySum / popIds.length : 0;
  const popRetention = popIds.length > 0 ? popRetainedCount / popIds.length : 0;

  // Category evolution data (recompute inline for delta)
  const userFirst = {}, userLast = {};
  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!userFirst[e.userId] || e.date < userFirst[e.userId]) userFirst[e.userId] = e.date;
    if (!userLast[e.userId] || e.date > userLast[e.userId]) userLast[e.userId] = e.date;
  }
  const earlyCounts = {}, lateCounts = {};
  categories.forEach(c => { earlyCounts[c] = 0; lateCounts[c] = 0; });
  let earlyTotal = 0, lateTotal = 0;
  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!e.category || !categories.includes(e.category)) continue;
    const first = userFirst[e.userId], last = userLast[e.userId];
    if (!first || !last) continue;
    const span = last - first;
    if (span < 7 * 86400000) continue;
    const mid = new Date(first.getTime() + span / 2);
    if (e.date < mid) { earlyCounts[e.category]++; earlyTotal++; }
    else { lateCounts[e.category]++; lateTotal++; }
  }

  // Per-user category counts (for segment identification)
  const userCatCounts = {}; // { userId: { cat: count, _total: count } }
  for (const uid of filteredUserIds) {
    userCatCounts[uid] = { _total: 0 };
    (excusesByUser[uid] || []).forEach(e => {
      if (e.category && categories.includes(e.category)) {
        userCatCounts[uid][e.category] = (userCatCounts[uid][e.category] || 0) + 1;
        userCatCounts[uid]._total++;
      }
    });
  }

  const segments = categories.map(cat => {
    // Find segment users: category is 25%+ of their categorized excuses
    const segUserIds = popIds.filter(uid => {
      const uc = userCatCounts[uid];
      if (!uc || uc._total === 0) return false;
      return ((uc[cat] || 0) / uc._total) >= 0.25;
    });

    // Segment stats
    let segStreakSum = 0, segEntrySum = 0, segRetained = 0;
    segUserIds.forEach(uid => {
      segStreakSum += (streakMap[uid]?.longest || 0);
      segEntrySum += (excusesByUser[uid]?.length || 0);
      const excs = excusesByUser[uid] || [];
      const lastDate = excs.reduce((max, e) => e.date && (!max || e.date > max) ? e.date : max, null);
      if (lastDate && (now - lastDate) <= FOURTEEN_DAYS) segRetained++;
    });

    const segSize = segUserIds.length;
    const segAvgStreak = segSize > 0 ? segStreakSum / segSize : 0;
    const segAvgEntries = segSize > 0 ? segEntrySum / segSize : 0;
    const segRetention = segSize > 0 ? segRetained / segSize : 0;

    // Category evolution delta
    const earlyPct = earlyTotal > 0 ? (earlyCounts[cat] / earlyTotal) * 100 : 0;
    const latePct = lateTotal > 0 ? (lateCounts[cat] / lateTotal) * 100 : 0;
    const delta = latePct - earlyPct;

    return {
      category: cat, earlyPct, latePct, delta,
      segmentUserIds: segUserIds, segmentSize: segSize,
      segmentAvgStreak: segAvgStreak, popAvgStreak,
      segmentRetention: segRetention, popRetention,
      segmentAvgEntries: segAvgEntries, popAvgEntries,
      retentionDelta: segRetention - popRetention,
    };
  }).filter(s => s.segmentSize >= 2); // need at least 2 users in a segment

  segments.sort((a, b) => b.retentionDelta - a.retentionDelta);
  return segments;
}

/**
 * Compute power user rankings.
 * @param {Object} excusesByUser - { userId: [excuse, ...] }
 * @param {Object} streakMap - from computeStreaks
 * @param {Object} diversityMap - from computeTextDiversity
 * @param {Set<string>} filteredUserIds
 * @param {Function} topCategoryFn - (categories) => string
 * @returns {Array<{ userId, userName, excuseCount, longest, uniqueDays, diversityPct, topCategory, score }>}
 */
export function computePowerUserRankings(excusesByUser, streakMap, diversityMap, filteredUserIds, topCategoryFn) {
  const users = [];
  for (const [userId, excs] of Object.entries(excusesByUser)) {
    if (!filteredUserIds.has(userId)) continue;
    const streak = streakMap[userId] || { longest: 0, uniqueDays: 0 };
    const diversity = diversityMap[userId] || { diversityPct: 0 };
    const cats = {};
    excs.forEach(e => {
      if (e.category) cats[e.category] = (cats[e.category] || 0) + 1;
    });
    users.push({
      userId,
      userName: excs[0]?.userName || userId,
      excuseCount: excs.length,
      longest: streak.longest,
      uniqueDays: streak.uniqueDays,
      diversityPct: diversity.diversityPct,
      topCategory: topCategoryFn(cats),
      firstDate: excs.reduce((min, e) => e.date && (!min || e.date < min) ? e.date : min, null),
      lastDate: excs.reduce((max, e) => e.date && (!max || e.date > max) ? e.date : max, null),
    });
  }

  if (users.length === 0) return [];

  // Normalize each dimension 0-1, then composite score
  const maxCount = Math.max(...users.map(u => u.excuseCount));
  const maxStreak = Math.max(...users.map(u => u.longest));
  const maxDiversity = Math.max(...users.map(u => u.diversityPct));

  for (const u of users) {
    const normCount = maxCount > 0 ? u.excuseCount / maxCount : 0;
    const normStreak = maxStreak > 0 ? u.longest / maxStreak : 0;
    const normDiversity = maxDiversity > 0 ? u.diversityPct / maxDiversity : 0;
    u.score = normCount * 0.4 + normStreak * 0.3 + normDiversity * 0.3;
  }

  users.sort((a, b) => b.score - a.score);
  return users;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Compute timing patterns: hourly counts, day-of-week counts, heatmap matrix, and urge frequency.
 * @param {Array} excuses
 * @param {Set<string>} filteredUserIds
 * @returns {{ hourlyCounts, dailyCounts, heatmap, peakHour, peakDay, perUserPerDay }}
 */
export function computeTimingPatterns(excuses, filteredUserIds) {
  const hourlyCounts = new Array(24).fill(0);
  const dailyCounts = new Array(7).fill(0);
  const heatmap = Array.from({ length: 7 }, () => new Array(24).fill(0));

  // For urge frequency: count excuses per user per calendar day
  const userDayCounts = {}; // { `${userId}|${dateStr}`: count }

  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    const hour = e.date.getHours();
    const day = e.date.getDay(); // 0=Sun
    hourlyCounts[hour]++;
    dailyCounts[day]++;
    heatmap[day][hour]++;

    const dateStr = e.date.toISOString().split('T')[0];
    const key = `${e.userId}|${dateStr}`;
    userDayCounts[key] = (userDayCounts[key] || 0) + 1;
  }

  // Peak hour and day
  const peakHour = hourlyCounts.indexOf(Math.max(...hourlyCounts));
  const peakDayIdx = dailyCounts.indexOf(Math.max(...dailyCounts));
  const peakDay = DAY_NAMES[peakDayIdx];

  // Urge frequency: bucket user-day counts
  const frequencies = Object.values(userDayCounts);
  const bucketDefs = [
    { label: '1-2', min: 1, max: 2 },
    { label: '3-5', min: 3, max: 5 },
    { label: '6-10', min: 6, max: 10 },
    { label: '11-20', min: 11, max: 20 },
    { label: '20+', min: 21, max: Infinity },
  ];
  const buckets = bucketDefs.map(b => ({
    label: b.label,
    count: frequencies.filter(f => f >= b.min && f <= b.max).length,
  }));

  const total = frequencies.reduce((s, v) => s + v, 0);
  const avgPerDay = frequencies.length > 0 ? total / frequencies.length : 0;
  const sorted = [...frequencies].sort((a, b) => a - b);
  const medianPerDay = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;

  return {
    hourlyCounts, dailyCounts, heatmap,
    peakHour, peakDay,
    perUserPerDay: { buckets, avgPerDay, medianPerDay, totalUserDays: frequencies.length },
  };
}

/**
 * Week 2 deep-dive: compare W1 behavior of users who survived to W2 vs those who churned.
 * @param {Array} excuses
 * @param {Set<string>} filteredUserIds
 * @param {string[]} categories
 * @returns {{ survivorCount, churnerCount, survivalRate, survivors, churners, totalEligible }}
 */
export function computeWeek2DeepDive(excuses, filteredUserIds, categories) {
  const now = new Date();
  const FOURTEEN_DAYS = 14 * 86400000;
  const SEVEN_DAYS = 7 * 86400000;

  // Group excuses by user
  const byUser = {};
  for (const e of excuses) {
    if (!filteredUserIds.has(e.userId) || !e.date) continue;
    if (!byUser[e.userId]) byUser[e.userId] = [];
    byUser[e.userId].push(e);
  }

  // For each user: find first date, split into W1/W2 excuses, determine eligibility
  const survivors = { users: [], w1Excuses: [] };
  const churners = { users: [], w1Excuses: [] };

  for (const [userId, excs] of Object.entries(byUser)) {
    excs.sort((a, b) => a.date - b.date);
    const first = excs[0].date;
    // Must have 14+ days of tenure to be eligible
    if ((now - first) < FOURTEEN_DAYS) continue;

    const w1 = excs.filter(e => (e.date - first) < SEVEN_DAYS);
    const w2 = excs.filter(e => (e.date - first) >= SEVEN_DAYS && (e.date - first) < FOURTEEN_DAYS);

    if (w1.length === 0) continue; // no W1 activity, skip

    if (w2.length > 0) {
      survivors.users.push(userId);
      survivors.w1Excuses.push(...w1);
    } else {
      churners.users.push(userId);
      churners.w1Excuses.push(...w1);
    }
  }

  const computeGroupMetrics = (userIds, w1Excs) => {
    if (userIds.length === 0) return { avgCount: 0, avgActiveDays: 0, avgLength: 0, avgDiversity: 0, categoryDist: {}, hourDist: new Array(24).fill(0) };

    // Per-user metrics
    let totalCount = 0, totalDays = 0, totalLen = 0, totalDiversity = 0;
    const catCounts = {};
    categories.forEach(c => { catCounts[c] = 0; });
    const hourDist = new Array(24).fill(0);

    for (const uid of userIds) {
      const userW1 = w1Excs.filter(e => e.userId === uid);
      totalCount += userW1.length;
      const days = new Set(userW1.map(e => e.date.toISOString().split('T')[0]));
      totalDays += days.size;
      for (const e of userW1) {
        totalLen += (e.text || '').length;
        if (categories.includes(e.category)) catCounts[e.category]++;
        hourDist[e.date.getHours()]++;
      }
      const texts = userW1.map(e => (e.text || '').trim().toLowerCase());
      const unique = new Set(texts).size;
      totalDiversity += texts.length > 0 ? unique / texts.length : 0;
    }

    const n = userIds.length;
    // Convert category counts to percentages
    const totalCat = Object.values(catCounts).reduce((s, v) => s + v, 0);
    const categoryDist = {};
    for (const [cat, count] of Object.entries(catCounts)) {
      categoryDist[cat] = totalCat > 0 ? (count / totalCat) * 100 : 0;
    }

    return {
      avgCount: totalCount / n,
      avgActiveDays: totalDays / n,
      avgLength: totalCount > 0 ? totalLen / totalCount : 0,
      avgDiversity: totalDiversity / n,
      categoryDist,
      hourDist,
    };
  };

  const totalEligible = survivors.users.length + churners.users.length;
  return {
    survivorCount: survivors.users.length,
    churnerCount: churners.users.length,
    survivalRate: totalEligible > 0 ? survivors.users.length / totalEligible : 0,
    survivors: computeGroupMetrics(survivors.users, survivors.w1Excuses),
    churners: computeGroupMetrics(churners.users, churners.w1Excuses),
    totalEligible,
  };
}

// ─── Unlock Minutes Requested (lifetime snapshot) ────────────────────────────
// `totalExtraMinutesRequested` on the user doc is a single cumulative lifetime
// total per user (sum of the 1/5/10/15-min granted unlock choices, online +
// offline). It is a point-in-time SNAPSHOT, not a time series — there is no
// per-day/per-event history behind it, so every function below is strictly
// cross-sectional. All of these exclude team accounts and users who have never
// requested an unlock (value 0 / absent). Diversity filtering does NOT apply:
// unlock minutes exist regardless of how varied a user's excuse text is.

const MIN_PER_HOUR = 60;

/**
 * Users with a positive lifetime `totalExtraMinutesRequested`, team excluded.
 * @param {Array} users - raw user docs ({ id, totalExtraMinutesRequested, ... })
 * @param {boolean} excludeTeam
 * @returns {Array} filtered user docs
 */
export function getMinutesUsers(users, excludeTeam = true) {
  return (users || []).filter(u => {
    if (excludeTeam && TEAM_USER_IDS.includes(u.id)) return false;
    return (Number(u.totalExtraMinutesRequested) || 0) > 0;
  });
}

/**
 * Summary stats over users with >0 minutes requested (zeros excluded entirely).
 * @returns {null | { countOverZero, grandTotalMin, grandTotalHrs, meanMin, meanHrs, medianMin, medianHrs, maxMin, maxHrs }}
 */
export function computeMinutesStats(users, excludeTeam = true) {
  const pop = getMinutesUsers(users, excludeTeam);
  if (pop.length === 0) return null;
  const vals = pop.map(u => Number(u.totalExtraMinutesRequested) || 0).sort((a, b) => a - b);
  const grandTotal = vals.reduce((s, v) => s + v, 0);
  const mean = grandTotal / vals.length;
  const mid = Math.floor(vals.length / 2);
  const median = vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
  const max = vals[vals.length - 1];
  return {
    countOverZero: vals.length,
    grandTotalMin: grandTotal,
    grandTotalHrs: grandTotal / MIN_PER_HOUR,
    meanMin: mean,
    meanHrs: mean / MIN_PER_HOUR,
    medianMin: median,
    medianHrs: median / MIN_PER_HOUR,
    maxMin: max,
    maxHrs: max / MIN_PER_HOUR,
  };
}

/**
 * Histogram of lifetime minutes requested, bucketed by hours (last bucket open-ended).
 * @returns {Array<{ label: string, loMin: number, hiMin: number, count: number }>}
 */
export function computeMinutesDistribution(users, excludeTeam = true) {
  const pop = getMinutesUsers(users, excludeTeam);
  const edgesHrs = [0, 1, 5, 10, 25, 50, 100]; // hour boundaries; last edge is open-ended
  const buckets = edgesHrs.map((lo, i) => {
    const hi = edgesHrs[i + 1];
    return {
      label: hi == null ? `${lo}h+` : `${lo}–${hi}h`,
      loMin: lo * MIN_PER_HOUR,
      hiMin: hi == null ? Infinity : hi * MIN_PER_HOUR,
      count: 0,
    };
  });
  pop.forEach(u => {
    const m = Number(u.totalExtraMinutesRequested) || 0;
    const b = buckets.find(bk => m >= bk.loMin && m < bk.hiMin);
    if (b) b.count++;
  });
  return buckets;
}

/**
 * Median minutes/hours requested per user, paying (subscriptionActive) vs free.
 * @returns {{ paying: GroupStat, free: GroupStat }} where GroupStat = { count, medianMin, medianHrs, totalMin }
 */
export function computeMinutesBySubscription(users, excludeTeam = true) {
  const pop = getMinutesUsers(users, excludeTeam);
  return summarizeMinutesBySubscription(pop);
}

/**
 * Scatter points of excuse count (x) vs minutes requested (y), one per user.
 * Null-safe: only users whose `excuseCount` field exists and is > 0 are included
 * (so "avg minutes per excuse" is well-defined). Users missing excuseCount are skipped.
 * @returns {Array<{ x, y, userId, name, minPerExcuse }>}
 */
export function computeMinutesVsExcuses(users, excludeTeam = true) {
  return getMinutesUsers(users, excludeTeam)
    .filter(u => Number.isFinite(Number(u.excuseCount)) && Number(u.excuseCount) > 0)
    .map(u => {
      const m = Number(u.totalExtraMinutesRequested) || 0;
      const c = Number(u.excuseCount);
      return {
        x: c,
        y: m,
        userId: u.id,
        name: u.displayName || u.name || u.email || u.id,
        minPerExcuse: m / c,
        subscriptionActive: !!u.subscriptionActive,
      };
    });
}

/**
 * Full per-user unlock-minutes table for export — every user with >0 lifetime
 * minutes (team excluded), sorted desc. Superset of the scatter population:
 * `excuseCount`/`minPerExcuse` are null when excuseCount is absent or 0.
 * @returns {Array<{ userId, name, minutes, hours, excuseCount: number|null, minPerExcuse: number|null, subscriptionActive: boolean }>}
 */
export function computeMinutesPerUser(users, excludeTeam = true) {
  return getMinutesUsers(users, excludeTeam)
    .map(u => {
      const minutes = Number(u.totalExtraMinutesRequested) || 0;
      const hasCount = Number.isFinite(Number(u.excuseCount)) && Number(u.excuseCount) > 0;
      const excuseCount = hasCount ? Number(u.excuseCount) : null;
      return {
        userId: u.id,
        name: u.displayName || u.name || u.email || u.id,
        minutes,
        hours: minutes / MIN_PER_HOUR,
        excuseCount,
        minPerExcuse: excuseCount ? minutes / excuseCount : null,
        subscriptionActive: !!u.subscriptionActive,
      };
    })
    .sort((a, b) => b.minutes - a.minutes);
}
