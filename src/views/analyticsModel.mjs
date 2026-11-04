const FLOW_VERSIONS = {
  v2: [2],
  v3: [3],
  v4: [4],
  v5: [5],
  v6: [6, 9],
  v10: [10],
  v14: [14],
  v17: [17],
  v18: [18],
};

const AB_EXPERIMENT_START_MS = Date.parse('2026-03-17T00:00:00-07:00');
const AB_EXPERIMENT_END_MS = Date.parse('2026-04-05T00:00:00-07:00');

function startedAtMs(session) {
  const value = session.started_at;
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  const result = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(result) ? result : null;
}

export function filterSessionsByVersion(sessions, version, cohort) {
  const versionSessions = version === 'v1'
    ? sessions.filter(session => !session.flow_version)
    : sessions.filter(session => (FLOW_VERSIONS[version] || FLOW_VERSIONS.v2).includes(session.flow_version));
  return cohort
    ? versionSessions.filter(session => session.flow_cohort === cohort)
    : versionSessions;
}

export function supportsABTesting(version) {
  return version === 'v2';
}

export function paywallScreenForVersion(version) {
  if (version === 'v1') return 'paywall';
  if (version === 'v17' || version === 'v18') return 'journey_paywall';
  return 'sky_paywall';
}

export function classifyABGroup(session, surveys, version) {
  if (!supportsABTesting(version) || !session.device_id) return null;
  const startedAt = startedAtMs(session);
  if (startedAt === null || startedAt < AB_EXPERIMENT_START_MS || startedAt >= AB_EXPERIMENT_END_MS) {
    return null;
  }
  const assignment = surveys.get(session.device_id)?.ab_showVideoIntro;
  return assignment === true ? 'A' : assignment === false ? 'B' : null;
}

export function addUserToLookup(lookup, id, data) {
  const user = { ...data, id };
  lookup.set(`uid:${id}`, user);

  if (!data.onboardingDeviceId) return;
  const deviceKey = `device:${data.onboardingDeviceId}`;
  lookup.set(deviceKey, lookup.has(deviceKey) ? null : user);
}

export function findSessionUser(session, lookup) {
  if (session.uid) return lookup.get(`uid:${session.uid}`) || null;
  return (session.device_id ? lookup.get(`device:${session.device_id}`) : null) || null;
}
