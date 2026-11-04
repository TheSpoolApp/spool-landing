import { formatLocalDate } from './dateRange.mjs';

// v18 records the opening itself. Resumed and older partially instrumented
// sessions must not acquire an opening-screen view that never occurred.
export function reachedScreenNames(session, inferredOpeningName = null) {
  const names = new Set(inferredOpeningName ? [inferredOpeningName] : []);
  for (const screen of session.screens_completed || []) {
    if (screen.screen_name) names.add(screen.screen_name);
  }
  if (session.last_screen_name) names.add(session.last_screen_name);
  return names;
}

export function setupStatusLabel(session) {
  if (session.dropped_off === false) return 'Completed';
  if (session.status === 'existing_account_sign_in') return 'Existing account sign-in';
  return session.dropped_off === true ? 'Unfinished' : 'Unknown';
}

// iOS writes true while onboarding is unfinished and false only on completion.
// Missing, null, and malformed flags are unknown, never successful completions.
export function completionSummary(sessions) {
  const total = sessions.length;
  const completed = sessions.filter(s => s.dropped_off === false).length;
  const unfinished = sessions.filter(s => s.dropped_off === true).length;
  return {
    total, completed, unfinished, unknown: total - completed - unfinished,
    completionRate: total ? (completed / total * 100).toFixed(1) : null,
  };
}

export function dailyCompletion(sessions) {
  const buckets = new Map();
  for (const session of sessions) {
    const raw = session.started_at;
    const date = raw?.toDate ? raw.toDate()
      : typeof raw?.seconds === 'number' ? new Date(raw.seconds * 1000)
      : new Date(raw ?? NaN);
    const day = Number.isFinite(date.getTime()) ? formatLocalDate(date) : 'Unknown date';
    if (!buckets.has(day)) buckets.set(day, []);
    buckets.get(day).push(session);
  }
  return [...buckets].sort(([a], [b]) => b.localeCompare(a))
    .map(([date, rows]) => ({ date, ...completionSummary(rows) }));
}

export function passedPaywall(session, order, paywallName) {
  const paywallIndex = order.findIndex(screen => screen.name === paywallName);
  if (paywallIndex < 0) return false;
  const after = new Set(order.slice(paywallIndex + 1).map(screen => screen.name));
  return after.has(session.last_screen_name) ||
    (session.screens_completed || []).some(screen => after.has(screen.screen_name));
}

// Fetch the complete selected window; never silently calculate on the latest 5,000.
export async function fetchAllSessionPages(fetchPage, isCurrent = () => true, pageSize = 1000) {
  const rows = new Map();
  let cursor = null;
  while (isCurrent()) {
    const docs = await fetchPage(cursor, pageSize);
    if (!isCurrent()) return null;
    for (const doc of docs) rows.set(doc.id, { ...doc.data(), id: doc.id });
    if (docs.length < pageSize) return [...rows.values()];
    cursor = docs[docs.length - 1];
  }
  return null;
}
