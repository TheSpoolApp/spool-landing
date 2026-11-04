import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  addUserToLookup,
  classifyABGroup,
  filterSessionsByVersion,
  findSessionUser,
  paywallScreenForVersion,
} from './analyticsModel.mjs';

const source = readFileSync(new URL('./AnalyticsPage.js', import.meta.url), 'utf8');

function catalogNames(name) {
  const catalog = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\];`));
  assert.ok(catalog, `${name} is missing`);
  return [...catalog[1].matchAll(/name: '([^']+)'/g)].map(match => match[1]);
}

test('v14 dashboard catalog matches the Firestore screen-name contract', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V14'), [
    'opening_carousel',
    'display_name',
    'age_selection',
    'screen_time_slider',
    'phone_usage_stats',
    'lifetime_stats',
    'average_lifespan',
    'review_request',
    'goal',
    'when_rot',
    'notification_priming',
    'referral_source',
    'thirty_day_transformation',
    'commitment_reason',
    'commitment_hold',
    'before_after',
    'first_week_roadmap',
    'personalized_plan',
    'sky_paywall',
    'welcome_to_spool',
    'name_collection',
    'create_account',
    'notification_permission',
    'screen_time_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('v10 dashboard catalog matches the current 4.27 Firestore contract', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V10'), [
    'welcome',
    'meet_spooli',
    'thread_unravel',
    'see_for_yourself',
    'modern_apps',
    'focus_web_intro',
    'instagram_reels_demo',
    'focus_web_apps',
    'how_did_you_hear',
    'chat_onboarding',
    'goal',
    'screen_time_affect',
    'profession',
    'when_rot',
    'tried_before',
    'age_selection',
    'screen_time_slider',
    'screen_time_connect',
    'screen_time_dialog',
    'notification_priming',
    'progress_bar',
    'grounding_breath',
    'archetype_reveal',
    'review_request',
    'top_app_demon',
    'phone_usage_stats',
    'lifetime_stats',
    'average_lifespan',
    'academic_studies',
    'weekly_benefits',
    'commitment_reason',
    'commitment_hold',
    'before_after',
    'personalized_plan',
    'sky_paywall',
    'welcome_to_spool',
    'name_collection',
    'create_account',
    'notification_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('v17 dashboard catalog matches the current fresh-flow Firestore contract', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V17'), [
    'welcome',
    'meet_spooli',
    'thread_unravel',
    'see_for_yourself',
    'modern_apps',
    'focus_web_intro',
    'instagram_reels_demo',
    'focus_web_apps',
    'how_did_you_hear',
    'chat_onboarding',
    'goal',
    'screen_time_affect',
    'profession',
    'when_rot',
    'tried_before',
    'age_selection',
    'screen_time_slider',
    'screen_time_connect',
    'screen_time_dialog',
    'notification_priming',
    'progress_bar',
    'grounding_breath',
    'archetype_reveal',
    'top_app_demon',
    'phone_usage_stats',
    'lifetime_stats',
    'average_lifespan',
    'academic_studies',
    'weekly_benefits',
    'commitment_reason',
    'commitment_hold',
    'before_after',
    'personalized_plan',
    'journey_paywall',
    'welcome_to_spool',
    'create_account',
    'notification_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('current v18 traffic is the default while historical versions remain selectable', () => {
  const sessions = [
    { id: 'legacy' },
    { id: 'v6', flow_version: 6 },
    { id: 'v9', flow_version: 9 },
    { id: 'v10', flow_version: 10 },
    { id: 'v14-fresh', flow_version: 14, flow_cohort: 'prayer_lock_carousel_v14' },
    { id: 'v14-existing', flow_version: 14, flow_cohort: 'existing_account_setup_v14' },
    { id: 'v17', flow_version: 17, flow_cohort: 'welcome_name_optional_chat_v17' },
    { id: 'v18', flow_version: 18, flow_cohort: 'transformation_story_v18' },
  ];

  assert.deepEqual(filterSessionsByVersion(sessions, 'v6').map(s => s.id), ['v6', 'v9']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v10').map(s => s.id), ['v10']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v14').map(s => s.id), ['v14-fresh', 'v14-existing']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v17').map(s => s.id), ['v17']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v18').map(s => s.id), ['v18']);
  assert.match(source, /useState\('v18'\)/);
  assert.match(source, /\{ id: 'v10', label: 'App 4\.27 \(v10\)'/);
  assert.match(source, /\{ id: 'v14', label: 'New Carousel \(v14\)'/);
  assert.match(source, /\{ id: 'v17', label: 'Previous \(v17\)'/);
  assert.match(source, /welcome_name_optional_chat_v17/);
  assert.match(source, /prayer_lock_carousel_v14 \+ existing_account_setup_v14/);
});

test('paywall reach uses the screen name emitted by each flow version', () => {
  assert.equal(paywallScreenForVersion('v1'), 'paywall');
  assert.equal(paywallScreenForVersion('v10'), 'sky_paywall');
  assert.equal(paywallScreenForVersion('v14'), 'sky_paywall');
  assert.equal(paywallScreenForVersion('v17'), 'journey_paywall');
  assert.equal(paywallScreenForVersion('v18'), 'journey_paywall');
  assert.match(source, /const pw = paywallScreenForVersion\(version\)/);
});

test('v14 cohorts are filtered before their distinct funnel entry screens are calculated', () => {
  const sessions = [
    { id: 'fresh', flow_version: 14, flow_cohort: 'prayer_lock_carousel_v14' },
    { id: 'existing', flow_version: 14, flow_cohort: 'existing_account_setup_v14' },
  ];

  assert.deepEqual(
    filterSessionsByVersion(sessions, 'v14', 'prayer_lock_carousel_v14').map(s => s.id),
    ['fresh'],
  );
  assert.deepEqual(
    filterSessionsByVersion(sessions, 'v14', 'existing_account_setup_v14').map(s => s.id),
    ['existing'],
  );
  assert.match(source, /useState\('prayer_lock_carousel_v14'\)/);
  assert.match(source, /SCREEN_ORDER_V14\.findIndex\(screen => screen\.name === 'screen_time_permission'\)/);
  assert.match(source, /label: 'Existing account setup'/);
  assert.match(source, /showsPaywallMetrics = !\(version === 'v14' && v14Cohort === 'existing_account_setup_v14'\)/);
  const v14Names = catalogNames('SCREEN_ORDER_V14');
  assert.deepEqual(v14Names.slice(v14Names.indexOf('screen_time_permission')), [
    'screen_time_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('legacy A/B membership is explicit and unavailable on later deterministic flows', () => {
  const surveys = new Map([
    ['group-a', { ab_showVideoIntro: true }],
    ['group-b', { ab_showVideoIntro: false }],
    ['missing', {}],
  ]);
  const randomizedSession = device_id => ({
    device_id,
    started_at: { toDate: () => new Date('2026-03-20T12:00:00Z') },
  });

  assert.equal(classifyABGroup(randomizedSession('group-a'), surveys, 'v2'), 'A');
  assert.equal(classifyABGroup(randomizedSession('group-b'), surveys, 'v2'), 'B');
  assert.equal(classifyABGroup(randomizedSession('missing'), surveys, 'v2'), null);
  assert.equal(classifyABGroup({ ...randomizedSession('group-a'), started_at: '2026-04-10' }, surveys, 'v2'), null);
  assert.equal(classifyABGroup({ device_id: 'group-a' }, surveys, 'v2'), null);
  assert.equal(classifyABGroup(randomizedSession('group-a'), surveys, 'v14'), null);
  assert.match(source, /const showABControls = supportsABSplit && \(abGroups\.groupA\.length > 0 \|\| abGroups\.groupB\.length > 0\)/);
  assert.match(source, /splitByAB && showABControls/);
  assert.match(source, /\{showABControls && \(/);
  assert.match(source, /showABControls && <td>\{row\.abGroup\}<\/td>/);
  assert.match(source, /row\.abGroup !== '--' && row\.survey\.ab_showVideoIntro !== undefined/);
});

test('device fallback exposes a user only when the identifier is unambiguous', () => {
  const users = new Map();
  addUserToLookup(users, 'uid-1', { email: 'one@example.com', onboardingDeviceId: 'shared' });
  addUserToLookup(users, 'uid-2', { email: 'two@example.com', onboardingDeviceId: 'shared' });
  addUserToLookup(users, 'uid-3', { email: 'three@example.com', onboardingDeviceId: 'unique' });

  assert.equal(findSessionUser({ uid: 'uid-1', device_id: 'shared' }, users)?.email, 'one@example.com');
  assert.equal(findSessionUser({ uid: 'missing', device_id: 'unique' }, users), null);
  assert.equal(findSessionUser({ device_id: 'shared' }, users), null);
  assert.equal(findSessionUser({ device_id: 'unique' }, users)?.email, 'three@example.com');
});

test('the active cohort is revealed inside the horizontal selector', () => {
  assert.match(source, /const revealSelectedVersion = useCallback\(node =>/);
  assert.match(source, /container\.scrollLeft \+= offset - \(container\.clientWidth - node\.clientWidth\) \/ 2/);
  assert.match(source, /ref=\{version === v\.id \? revealSelectedVersion : null\}/);
});

test('session explorer reports the persisted stop screen when available', () => {
  assert.match(source, /let lastScreen = s\.last_screen_name \|\| '--'/);
});

test('date-filtered funnels distinguish RevenueCat acquisition from Firestore sessions', () => {
  assert.match(source, /RevenueCat New Customers/);
  assert.match(source, /All flow versions · RevenueCat acquisition count/);
  assert.match(source, /Selected flow only · latest record per device/);
});

test('current v17 exposes all personalization question breakdowns', () => {
  assert.match(
    source,
    /\['v5', 'v6', 'v10', 'v14', 'v17', 'v18'\]\.includes\(version\)/,
  );
  for (const field of [
    'goal',
    'screenTimeAffect',
    'profession',
    'whenRot',
    'triedBefore',
    'archetypeName',
    'stimulationExposure',
    'daytimeVulnerability',
  ]) {
    assert.match(source, new RegExp(`key: '${field}'`));
  }
});


test('v18 follows the transformation story through verified blocking activation', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V18'), ['opening_carousel', 'instagram_comparison', 'youtube_comparison', 'supported_apps', 'referral_source', 'scrolling_hours', 'age', 'social_media_reasons', 'previous_attempts', 'turning_point', 'life_weeks', 'time_cost', 'opportunities', 'not_your_fault', 'industry_voices', 'pathway', 'research', 'expert_feedback', 'community_proof', 'rating_request', 'annual_target', 'commitment', 'celebration', 'personalized_plan', 'journey_paywall', 'welcome_to_spool', 'name_collection', 'create_account', 'notification_permission', 'screen_time_permission', 'daily_request_pool', 'choose_apps', 'schedule_selection', 'blocking_confirmation']);
  assert.match(source, /version === 'v18' \? SCREEN_ORDER_V18/);
  assert.match(source, /label: 'Current \(v18\)'/);
  assert.match(source, /transformation_story_v18/);
  assert.match(source, /reachedScreenNames\(session, version === 'v18' \? null : firstScreen\)/);
});

test('v18 survey breakdowns use the new questions and the matching attempt', () => {
  for (const field of ['socialMediaReasons', 'previousAttempts', 'targetAnnualHours', 'intention']) {
    assert.match(source, new RegExp(`key: '${field}'`));
  }
  assert.match(source, /version === 'v18' \? V18_SURVEY_FIELDS : V5_SURVEY_FIELDS/);
  assert.match(source, /survey\?\.onboarding_attempt_id !== s\.onboarding_attempt_id/);
});
