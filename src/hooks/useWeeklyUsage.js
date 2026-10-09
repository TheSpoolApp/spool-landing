"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { WEEKLY_USAGE_CACHE_MS, WEEKLY_USAGE_VERSION } from '../lib/weeklyUsage.mjs';

function validReport(report) {
  const count = value => Number.isInteger(value) && value >= 0;
  return report?.version === WEEKLY_USAGE_VERSION
    && Number.isFinite(Date.parse(report.generatedAt))
    && Number.isFinite(Date.parse(report.observationCutoff))
    && ['excuseRecords', 'activeUsers', 'eligibleUsers', 'invalidTimestampUsers'].every(key => count(report[key]))
    && report.cohorts?.length === 3
    && report.cohorts.every((cohort, index) => cohort?.minActiveDays === [1, 3, 5][index]
      && count(cohort.users) && count(cohort.missingDurationUsers)
      && cohort.weeks?.length === 3
      && cohort.weeks.every((week, w) => week?.week === w + 1
        && count(week.usersDecreased) && week.usersDecreased <= cohort.users
        && ['meanMinutes', 'changeMinutes', 'changePercent'].every(key => cohort.users ? Number.isFinite(week[key]) : week[key] === null)
        && (cohort.users
          ? Array.isArray(week.changeInterval) && week.changeInterval.length === 2
            && week.changeInterval.every(Number.isFinite) && week.changeInterval[0] <= week.changeInterval[1]
          : week.changeInterval === null)));
}

function readCache(key) {
  try {
    const report = JSON.parse(sessionStorage.getItem(key));
    return validReport(report) ? report : null;
  } catch { return null; }
}

export default function useWeeklyUsage(user) {
  const key = `spool-weekly-usage-v${WEEKLY_USAGE_VERSION}:${user.uid}`;
  const [report, setReport] = useState(() => readCache(key));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pending = useRef(null);

  const fetchReport = useCallback((refresh = false) => {
    if (pending.current) return pending.current;
    setLoading(true);
    setError(null);
    pending.current = (async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/analytics/weekly-usage${refresh ? '?refresh=1' : ''}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          signal: AbortSignal.timeout(55000),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Weekly usage could not be loaded.');
        if (!validReport(data)) throw new Error('The report was incomplete. Please refresh again.');
        setReport(data);
        try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* Storage may be disabled. */ }
      } catch (err) {
        setError(err.name === 'TimeoutError' ? 'The refresh timed out. Please try again.' : err.message);
      } finally {
        setLoading(false);
        pending.current = null;
      }
    })();
    return pending.current;
  }, [key, user]);

  useEffect(() => {
    const cached = readCache(key);
    if (!cached || Date.now() - Date.parse(cached.generatedAt) >= WEEKLY_USAGE_CACHE_MS) fetchReport();
  }, [key, fetchReport]);

  return { report, loading, error, refresh: () => fetchReport(true) };
}
