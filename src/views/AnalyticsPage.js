"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, where, getDocs, Timestamp, limit, startAfter } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import useRevenueCatOverview from '../hooks/useRevenueCatOverview';
import {
  addUserToLookup,
  classifyABGroup,
  filterSessionsByVersion,
  findSessionUser,
  paywallScreenForVersion,
  supportsABTesting,
} from './analyticsModel.mjs';
import { median, medianDurationsByScreen } from '../lib/analyticsMetrics.mjs';
import { endOfLocalDay, startOfLocalDay } from '../lib/dateRange.mjs';
import { completionSummary, dailyCompletion, passedPaywall, fetchAllSessionPages, reachedScreenNames, setupStatusLabel } from '../lib/onboardingMetrics.mjs';
import './AnalyticsPage.css';

Chart.register(...registerables);

const SCREEN_ORDER_V1 = [
  { number: -1, name: 'video_outro', label: 'Video Outro' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'enable_screen_time', label: 'Enable ST' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 10, name: 'paywall', label: 'Paywall' },
];

const SCREEN_ORDER_V2 = [
  { number: 0, name: 'video_intro', label: 'Video Intro' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

const SCREEN_ORDER_V3 = [
  { number: 0, name: 'video_intro', label: 'Video Intro' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_ritual', label: 'Commitment' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// v4 source of truth: analyticsScreenName in SpoolOnboardingFlowView.swift:971-1006.
// SPO-192 changes vs v3:
//  - screen 0: VideoIntroView → WelcomeView (screen_name "video_intro" → "welcome")
//  - screen 0.25: new NameInputView ("name_input") — distinct from name_collection at 12
//  - screen 0.75: new ChatOnboardingView ("chat_onboarding")
//  - screen 10.5: SkyPaywallView → JourneyPaywallView, but iOS kept screen_name "sky_paywall"
//    for time-series continuity. Disambiguate via PostHog paywall_type field.
//  - screen 10 (GlassPaywallView, soft skippable) has no case → written as "unknown_10.0".
//    Intentionally omitted from the funnel.
const SCREEN_ORDER_V4 = [
  { number: 0, name: 'welcome', label: 'Welcome' },
  { number: 0.25, name: 'name_input', label: 'Name Input' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 0.75, name: 'chat_onboarding', label: 'Chat (Spooli)' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_ritual', label: 'Commitment' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall (Journey)' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// v5 changes vs v4. screen_name strings confirmed against iOS
// SpoolOnboardingFlowView.swift analyticsScreenName (2026-06-15):
//  - removed: name_input, checkbox_selection (main_issue), life_in_dots
//  - new Spooli intro arc after welcome: meet_spooli, thread_unravel, see_for_yourself, modern_apps
//  - new personalization questions after chat: goal, screen_time_affect, profession, when_rot, tried_before
//  - archetype arc at 5 to 5.6: progress_bar (the loading screen, legacy screen_name),
//    grounding_breath, archetype_reveal, top_app_demon (re-added; was cut in the first v5 draft)
//  - commitment_ritual split into commitment_reason + commitment_hold
// flow_version is always 5 in this build (showCommitmentRitual is unconditionally true).
// Funnel matches by screen_name; `number` is only a display-ordering annotation (array
// order drives the chart), so it need not equal the literal Firestore screen_number.
const SCREEN_ORDER_V5 = [
  { number: 0, name: 'welcome', label: 'Welcome' },
  { number: 0.1, name: 'meet_spooli', label: 'Meet Spooli' },
  { number: 0.2, name: 'thread_unravel', label: 'Thread Unravel' },
  { number: 0.3, name: 'see_for_yourself', label: 'See For Yourself' },
  { number: 0.4, name: 'modern_apps', label: 'Modern Apps' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 0.75, name: 'chat_onboarding', label: 'Chat (Spooli)' },
  { number: 1, name: 'goal', label: 'Goal' },
  { number: 1.25, name: 'screen_time_affect', label: 'ST Affect' },
  { number: 1.5, name: 'profession', label: 'Profession' },
  { number: 1.75, name: 'when_rot', label: 'When Rot' },
  { number: 2, name: 'tried_before', label: 'Tried Before' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Loading' },
  { number: 5.2, name: 'grounding_breath', label: 'Breathing' },
  { number: 5.4, name: 'archetype_reveal', label: 'Archetype' },
  { number: 5.6, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.25, name: 'commitment_reason', label: 'Commit Reason' },
  { number: 9.5, name: 'commitment_hold', label: 'Commit Hold' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// "v6" tab = the historical reels-demo + personalized-plan onboarding. CONFIRMED against iOS
// SpoolOnboardingFlowView.swift analyticsScreenName (2026-07-22, via iOS Claude). Emitted by
// two builds with identical screens: flow_version 6 (cohort instagram_demo_v6) and
// flow_version 9 (cohort personal_plan_reveal_v9) — the `sessions` filter folds both.
// NOT an A/B split; cohort is deterministic from install/resume state.
// New vs v5:
//  - "focus web / reels" demo arc after modern_apps: focus_web_intro, instagram_reels_demo,
//    focus_web_apps (0.425 to 0.475)
//  - notification_priming at 4.85 (after screen_time_dialog) — distinct from the post-paywall
//    notification_permission at 14
//  - personalized_plan at 9.85 (after before_after, immediately before the paywall)
//  - goal arc 1.25 to 1.45, commitment split 9.5/9.6 (numbers are display-ordering only;
//    funnel matches by screen_name)
// Paywall trap at 10.5: analyticsScreenName returns "sky_paywall" but the rendered view is
// JourneyPaywallView (paywall_type "journey"). The sky_paywall bar IS the journey paywall.
// Conditional / low-traffic-by-design bars (not bugs):
//  - name_collection (12): shown only to fresh, name-less users; skipped if already authed
//    (->14) or a name was captured earlier (->13)
//  - create_account (13): skipped when a Firebase user already exists (resumed after purchase)
// Never emitted by this flow: screen 10 (Glass paywall, dead code — jumps 9.85 -> 10.5);
// screen 15 (app-blocker permission, always skipped, 14 -> 16).
// New top-level session fields (not yet surfaced here): flow_cohort, onboarding_attempt_id.
const SCREEN_ORDER_V6 = [
  { number: 0, name: 'welcome', label: 'Welcome' },
  { number: 0.1, name: 'meet_spooli', label: 'Meet Spooli' },
  { number: 0.2, name: 'thread_unravel', label: 'Thread Unravel' },
  { number: 0.3, name: 'see_for_yourself', label: 'See For Yourself' },
  { number: 0.4, name: 'modern_apps', label: 'Modern Apps' },
  { number: 0.425, name: 'focus_web_intro', label: 'Focus Web Intro' },
  { number: 0.45, name: 'instagram_reels_demo', label: 'Reels Demo' },
  { number: 0.475, name: 'focus_web_apps', label: 'Focus Web Apps' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 0.75, name: 'chat_onboarding', label: 'Chat (Spooli)' },
  { number: 1.25, name: 'goal', label: 'Goal' },
  { number: 1.3, name: 'screen_time_affect', label: 'ST Affect' },
  { number: 1.35, name: 'profession', label: 'Profession' },
  { number: 1.4, name: 'when_rot', label: 'When Rot' },
  { number: 1.45, name: 'tried_before', label: 'Tried Before' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 4.85, name: 'notification_priming', label: 'Notif Priming' },
  { number: 5, name: 'progress_bar', label: 'Loading' },
  { number: 5.2, name: 'grounding_breath', label: 'Breathing' },
  { number: 5.4, name: 'archetype_reveal', label: 'Archetype' },
  { number: 5.6, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_reason', label: 'Commit Reason' },
  { number: 9.6, name: 'commitment_hold', label: 'Commit Hold' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 9.85, name: 'personalized_plan', label: 'Personalized Plan' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// v10 = the current 4.27 production flow. It keeps the reels-demo acquisition
// journey, moves Review before Top App Demon, and adds the Apps alternative to
// the retained post-purchase setup.
const SCREEN_ORDER_V10 = [
  { number: 0, name: 'welcome', label: 'Welcome' },
  { number: 0.1, name: 'meet_spooli', label: 'Meet Spooli' },
  { number: 0.2, name: 'thread_unravel', label: 'Thread Unravel' },
  { number: 0.3, name: 'see_for_yourself', label: 'See For Yourself' },
  { number: 0.4, name: 'modern_apps', label: 'Modern Apps' },
  { number: 0.425, name: 'focus_web_intro', label: 'Focus Web Intro' },
  { number: 0.45, name: 'instagram_reels_demo', label: 'Reels Demo' },
  { number: 0.475, name: 'focus_web_apps', label: 'Focus Web Apps' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 0.75, name: 'chat_onboarding', label: 'Chat (Spooli)' },
  { number: 1.25, name: 'goal', label: 'Goal' },
  { number: 1.3, name: 'screen_time_affect', label: 'ST Affect' },
  { number: 1.35, name: 'profession', label: 'Profession' },
  { number: 1.4, name: 'when_rot', label: 'When Rot' },
  { number: 1.45, name: 'tried_before', label: 'Tried Before' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 4.85, name: 'notification_priming', label: 'Notif Priming' },
  { number: 5, name: 'progress_bar', label: 'Loading' },
  { number: 5.2, name: 'grounding_breath', label: 'Breathing' },
  { number: 5.4, name: 'archetype_reveal', label: 'Archetype' },
  { number: 5.5, name: 'review_request', label: 'Review' },
  { number: 5.6, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_reason', label: 'Commit Reason' },
  { number: 9.6, name: 'commitment_hold', label: 'Commit Hold' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 9.85, name: 'personalized_plan', label: 'Personalized Plan' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome to Spool' },
  { number: 12, name: 'name_collection', label: 'Name (Fallback)' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Thread Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Request Flow' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 21.5, name: 'focus_hub_alternative', label: 'Apps Alternative' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// v14 = the transformation-first carousel onboarding introduced in the 4.30
// main snapshot and retained by the current 4.32 main branch.
// Match and order by screen_name: its acquisition ordinals 11–19 overlap the retained
// post-purchase route's raw screen numbers, and sky_paywall is written by both coordinators.
// The three opening slides intentionally share one opening_carousel timing row.
const SCREEN_ORDER_V14 = [
  { number: 1, name: 'opening_carousel', label: 'Opening Carousel' },
  { number: 2, name: 'display_name', label: 'Your Name' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 5, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 6, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 7, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8, name: 'review_request', label: 'Review' },
  { number: 9, name: 'goal', label: 'Goal' },
  { number: 10, name: 'when_rot', label: 'Usage Time' },
  { number: 11, name: 'notification_priming', label: 'Notif Primer' },
  { number: 12, name: 'referral_source', label: 'How Heard' },
  { number: 13, name: 'thirty_day_transformation', label: '30-Day Result' },
  { number: 14, name: 'commitment_reason', label: 'Commit Reason' },
  { number: 15, name: 'commitment_hold', label: 'Commit Hold' },
  { number: 16, name: 'before_after', label: 'Before/After' },
  { number: 17, name: 'first_week_roadmap', label: 'First Week' },
  { number: 18, name: 'personalized_plan', label: 'Personalized Plan' },
  { number: 19, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome to Spool' },
  { number: 12, name: 'name_collection', label: 'Name (Fallback)' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 15, name: 'screen_time_permission', label: 'Screen Time' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Thread Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Request Flow' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 21.5, name: 'focus_hub_alternative', label: 'Apps Alternative' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];
const SCREEN_ORDER_V14_EXISTING_ACCOUNT = SCREEN_ORDER_V14.slice(
  SCREEN_ORDER_V14.findIndex(screen => screen.name === 'screen_time_permission')
);

// v17 = the fresh acquisition flow shipped around Sep 21, 2026. This contract
// matches iOS main at 190ff0e (flow_cohort welcome_name_optional_chat_v17).
// Name and Screen Time permission are collected earlier in the normal fresh
// route, so their recovery-only post-purchase screens are intentionally omitted.
const SCREEN_ORDER_V17 = [
  { number: 0, name: 'welcome', label: 'Welcome' },
  { number: 0.1, name: 'meet_spooli', label: 'Meet Spooli' },
  { number: 0.2, name: 'thread_unravel', label: 'Thread Unravel' },
  { number: 0.3, name: 'see_for_yourself', label: 'See For Yourself' },
  { number: 0.4, name: 'modern_apps', label: 'Modern Apps' },
  { number: 0.425, name: 'focus_web_intro', label: 'Focus Web Intro' },
  { number: 0.45, name: 'instagram_reels_demo', label: 'Reels Demo' },
  { number: 0.475, name: 'focus_web_apps', label: 'Focus Web Apps' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 0.75, name: 'chat_onboarding', label: 'Chat (Spooli)' },
  { number: 1.25, name: 'goal', label: 'Goal' },
  { number: 1.3, name: 'screen_time_affect', label: 'ST Affect' },
  { number: 1.35, name: 'profession', label: 'Profession' },
  { number: 1.4, name: 'when_rot', label: 'When Rot' },
  { number: 1.45, name: 'tried_before', label: 'Tried Before' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 4.85, name: 'notification_priming', label: 'Notif Priming' },
  { number: 5, name: 'progress_bar', label: 'Loading' },
  { number: 5.2, name: 'grounding_breath', label: 'Breathing' },
  { number: 5.4, name: 'archetype_reveal', label: 'Archetype' },
  { number: 5.6, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_reason', label: 'Commit Reason' },
  { number: 9.6, name: 'commitment_hold', label: 'Commit Hold' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 9.85, name: 'personalized_plan', label: 'Personalized Plan' },
  { number: 10.5, name: 'journey_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome to Spool' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Thread Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Request Flow' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 21.5, name: 'focus_hub_alternative', label: 'Apps Alternative' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// v18 transformation story. Names match OnboardingSessionProgress.swift and
// the retained setup coordinator. Array order follows the actual route, including
// the pool -> apps -> preset sequence; raw screen numbers are not ordinals.
const SCREEN_ORDER_V18 = [
  { number: 0, name: 'opening_carousel', label: 'Welcome Carousel' },
  { number: 0.05, name: 'instagram_comparison', label: 'Instagram Comparison' },
  { number: 0.1, name: 'youtube_comparison', label: 'YouTube Comparison' },
  { number: 0.2, name: 'supported_apps', label: 'Supported Apps' },
  { number: 1, name: 'referral_source', label: 'How Heard' },
  { number: 2, name: 'scrolling_hours', label: 'Daily Scrolling' },
  { number: 3, name: 'age', label: 'Age' },
  { number: 4, name: 'social_media_reasons', label: 'Why Keep Social Media' },
  { number: 5, name: 'previous_attempts', label: 'Previous Attempts' },
  { number: 6, name: 'turning_point', label: 'Turning Point' },
  { number: 6.1, name: 'life_weeks', label: 'Life in Weeks' },
  { number: 6.2, name: 'time_cost', label: 'Time Cost' },
  { number: 6.3, name: 'opportunities', label: 'Opportunities' },
  { number: 6.4, name: 'not_your_fault', label: 'Not Your Fault' },
  { number: 7, name: 'industry_voices', label: 'Industry Voices' },
  { number: 8.1, name: 'pathway', label: 'Spool Works' },
  { number: 8.2, name: 'research', label: 'Research' },
  { number: 8.3, name: 'expert_feedback', label: 'Expert Feedback' },
  { number: 8.4, name: 'community_proof', label: 'Community' },
  { number: 8.5, name: 'rating_request', label: 'Reviews' },
  { number: 8.6, name: 'annual_target', label: 'Time Back' },
  { number: 8.7, name: 'commitment', label: 'Commitment' },
  { number: 8.8, name: 'celebration', label: 'Celebration' },
  { number: 9.85, name: 'personalized_plan', label: 'Personalized Plan' },
  { number: 10.5, name: 'journey_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome to Spool' },
  { number: 12, name: 'name_collection', label: 'Your Name' },
  { number: 13, name: 'create_account', label: 'Create Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 15, name: 'screen_time_permission', label: 'Connect Screen Time' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool Goal' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 16, name: 'schedule_selection', label: 'First Rule' },
  { number: 22, name: 'blocking_confirmation', label: 'Activate Protection' },
];

// v5 survey/personalization answers (onboarding_surveys) shown as per-answer breakdowns.
// archetypeId backs up archetypeName so computed archetypes still chart if the name is missing.
const V5_SURVEY_FIELDS = [
  { key: 'goal', label: 'Goal' },
  { key: 'screenTimeAffect', label: 'Screen Time Affect' },
  { key: 'profession', label: 'Profession' },
  { key: 'whenRot', label: 'When They Rot' },
  { key: 'triedBefore', label: 'Tried Before' },
  { key: 'archetypeName', fallbackKey: 'archetypeId', label: 'Archetype' },
  { key: 'stimulationExposure', label: 'Stimulation Exposure', bucketScore: true },
  { key: 'daytimeVulnerability', label: 'Daytime Vulnerability', bucketScore: true },
];

const V18_SURVEY_FIELDS = [
  { key: 'socialMediaReasons', label: 'Why Keep Social Media' },
  { key: 'previousAttempts', label: 'Previous Attempts' },
  { key: 'targetAnnualHours', label: 'Annual Time Back Goal' },
  { key: 'intention', label: 'Intention' },
];

// stimulationExposure / daytimeVulnerability land as 0-1 float scores —
// bucket them so the breakdown isn't one bar per user
function bucketZeroToOne(v) {
  if (typeof v !== 'number' || isNaN(v)) return String(v);
  if (v < 0.2) return '0.0–0.2';
  if (v < 0.4) return '0.2–0.4';
  if (v < 0.6) return '0.4–0.6';
  if (v < 0.8) return '0.6–0.8';
  return '0.8–1.0';
}

function AnalyticsPage({ panelMode = false, dateFrom: propsDateFrom, dateTo: propsDateTo } = {}) {
  const { user, handleSignIn, handleSignOut: signOutBase } = useFirebaseAuth();
  const { overview: revenueCatOverview, error: revenueCatError, loading: revenueCatLoading } = useRevenueCatOverview(
    user,
    panelMode ? propsDateFrom : null,
    panelMode ? propsDateTo : null,
    true,
  );
  const [allSessions, setAllSessions] = useState([]);
  const [surveys, setSurveys] = useState(new Map());
  const [usersMap, setUsersMap] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const sessionRequest = useRef(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [version, setVersion] = useState('v18');
  const [v14Cohort, setV14Cohort] = useState('prayer_lock_carousel_v14');
  const [splitByAB, setSplitByAB] = useState(false);
  const [expandedSessionIdx, setExpandedSessionIdx] = useState(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionSortField, setSessionSortField] = useState('date');
  const [sessionSortDir, setSessionSortDir] = useState('desc');

  const funnelChartRef = useRef(null);
  const dropoffChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const funnelInstance = useRef(null);
  const dropoffInstance = useRef(null);
  const timeInstance = useRef(null);

  const screenOrder =
    version === 'v1' ? SCREEN_ORDER_V1 :
    version === 'v18' ? SCREEN_ORDER_V18 :
    version === 'v17' ? SCREEN_ORDER_V17 :
    version === 'v14' && v14Cohort === 'existing_account_setup_v14'
      ? SCREEN_ORDER_V14_EXISTING_ACCOUNT :
    version === 'v14' ? SCREEN_ORDER_V14 :
    version === 'v10' ? SCREEN_ORDER_V10 :
    version === 'v6' ? SCREEN_ORDER_V6 :
    version === 'v5' ? SCREEN_ORDER_V5 :
    version === 'v4' ? SCREEN_ORDER_V4 :
    version === 'v3' ? SCREEN_ORDER_V3 :
    SCREEN_ORDER_V2;

  // Filter sessions by version
  const sessions = useMemo(
    () => filterSessionsByVersion(allSessions, version, version === 'v14' ? v14Cohort : null),
    [allSessions, version, v14Cohort],
  );
  const supportsABSplit = supportsABTesting(version);
  const showsPaywallMetrics = !(version === 'v14' && v14Cohort === 'existing_account_setup_v14');

  useEffect(() => {
    if (!user) return;
    if (panelMode) {
      fetchSessions(propsDateFrom, propsDateTo);
    } else {
      fetchSessions();
    }
    fetchSurveys();
    fetchUsers();
    return () => { sessionRequest.current += 1; };
  }, [user, panelMode, propsDateFrom, propsDateTo]);

  const handleSignOut = async () => {
    await signOutBase();
    sessionRequest.current += 1;
    setAllSessions([]);
    setSurveys(new Map());
    setUsersMap(new Map());
  };

  const fetchSessions = async (startDate, endDate) => {
    const request = ++sessionRequest.current;
    const isCurrent = () => request === sessionRequest.current;
    setLoading(true);
    setSessionError(null);
    setAllSessions([]);
    try {
      const constraints = [orderBy('started_at', 'desc')];
      if (startDate) {
        constraints.push(where(
          'started_at',
          '>=',
          Timestamp.fromDate(startOfLocalDay(startDate)),
        ));
      }
      if (endDate) {
        constraints.push(where(
          'started_at',
          '<=',
          Timestamp.fromDate(endOfLocalDay(endDate)),
        ));
      }
      const data = await fetchAllSessionPages(async (cursor, pageSize) => {
        const pageConstraints = [...constraints, limit(pageSize)];
        if (cursor) pageConstraints.push(startAfter(cursor));
        const snapshot = await getDocs(query(collection(db, 'onboarding_sessions'), ...pageConstraints));
        return snapshot.docs;
      }, isCurrent);
      if (data && isCurrent()) setAllSessions(data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (isCurrent()) setSessionError('Could not load the complete date range. Retry before using these metrics.');
    } finally {
      if (isCurrent()) setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'onboarding_surveys'));
      const map = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Key by document ID (which IS the device ID) and also by data.device_id if present
        map.set(doc.id, data);
        if (data.device_id) {
          map.set(data.device_id, data);
        }
      });
      setSurveys(map);
    } catch (err) {
      console.error('Fetch surveys error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const map = new Map();
      snapshot.docs.forEach(doc => {
        addUserToLookup(map, doc.id, doc.data());
      });
      setUsersMap(map);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleRefresh = () => {
    fetchSessions(dateFrom || null, dateTo || null);
    fetchSurveys();
  };

  // Get A/B group for a session
  const getABGroup = useCallback((session) => {
    return classifyABGroup(session, surveys, version);
  }, [surveys, version]);

  // Compute analytics for a given set of sessions
  const computeForSessions = useCallback((sessionList, order) => {
    const total = sessionList.length;
    if (total === 0) return null;

    const screenCounts = {};

    order.forEach(s => {
      screenCounts[s.name] = 0;
    });

    let paywallReached = 0;
    let droppedOff = 0;
    let prePaywallDropoff = 0;
    const totalTimeValues = [];

    const firstScreen = order[0].name;
    const pw = paywallScreenForVersion(version);

    sessionList.forEach(session => {
      const seenScreens = reachedScreenNames(session, version === 'v18' ? null : firstScreen);
      seenScreens.forEach(name => {
        if (screenCounts[name] !== undefined) screenCounts[name]++;
      });

      if (session.reached_paywall) {
        paywallReached++;
        // Only count paywall if not already counted from screens_completed
        if (screenCounts[pw] !== undefined && !seenScreens.has(pw)) {
          screenCounts[pw]++;
          seenScreens.add(pw);
        }
      }
      if (session.dropped_off === true) {
        droppedOff++;
        if (!session.reached_paywall) {
          prePaywallDropoff++;
        }
      }
      if (session.total_time_seconds > 0) {
        totalTimeValues.push(Number(session.total_time_seconds));
      }
    });

    const medianScreenTimes = medianDurationsByScreen(sessionList, order.map(screen => screen.name));

    return {
      total,
      paywallReached,
      paywallRate: ((paywallReached / total) * 100).toFixed(1),
      droppedOff,
      dropoffRate: ((droppedOff / total) * 100).toFixed(1),
      prePaywallDropoff,
      prePaywallDropoffRate: ((prePaywallDropoff / total) * 100).toFixed(1),
      ...completionSummary(sessionList),
      medianTotalTime: totalTimeValues.length > 0 ? median(totalTimeValues).toFixed(0) : 0,
      screenCounts,
      medianScreenTimes,
    };
  }, [version]);

  const computeAnalytics = useCallback(() => {
    return computeForSessions(sessions, screenOrder);
  }, [sessions, screenOrder, computeForSessions]);

  // Split sessions by A/B
  const abGroups = useMemo(() => {
    const groupA = [];
    const groupB = [];
    sessions.forEach(s => {
      const group = getABGroup(s);
      if (group === 'A') groupA.push(s);
      else if (group === 'B') groupB.push(s);
    });
    return { groupA, groupB };
  }, [sessions, getABGroup]);
  const showABControls = supportsABSplit && (abGroups.groupA.length > 0 || abGroups.groupB.length > 0);

  // Helper to build chart datasets
  const buildFunnelData = useCallback((sessionList, order) => {
    const analytics = computeForSessions(sessionList, order);
    if (!analytics) return null;
    const screenNames = order.map(s => s.name);
    return screenNames.map(name => analytics.screenCounts[name] || 0);
  }, [computeForSessions]);

  const buildDropoffData = (funnelData) => {
    const result = [];
    for (let i = 0; i < funnelData.length - 1; i++) {
      const current = funnelData[i];
      const next = funnelData[i + 1];
      result.push(current > 0 ? (((current - next) / current) * 100).toFixed(1) : 0);
    }
    result.push(0);
    return result;
  };

  const buildMedianTimeData = useCallback((sessionList, order) => {
    const analytics = computeForSessions(sessionList, order);
    if (!analytics) return null;
    const screenNames = order.map(s => s.name);
    return screenNames.map(name => Number(analytics.medianScreenTimes[name] ?? 0).toFixed(1));
  }, [computeForSessions]);

  // Render charts whenever sessions/version/splitByAB change
  useEffect(() => {
    // Destroy old charts first so a version with no sessions shows empty canvases,
    // not the previous version's charts
    if (funnelInstance.current) { funnelInstance.current.destroy(); funnelInstance.current = null; }
    if (dropoffInstance.current) { dropoffInstance.current.destroy(); dropoffInstance.current = null; }
    if (timeInstance.current) { timeInstance.current.destroy(); timeInstance.current = null; }

    const analytics = computeAnalytics();
    if (!analytics) return;

    const labels = screenOrder.map(s => s.label);
    const screenNames = screenOrder.map(s => s.name);

    if (splitByAB && showABControls) {
      const funnelA = buildFunnelData(abGroups.groupA, screenOrder) || screenNames.map(() => 0);
      const funnelB = buildFunnelData(abGroups.groupB, screenOrder) || screenNames.map(() => 0);
      const dropoffA = buildDropoffData(funnelA);
      const dropoffB = buildDropoffData(funnelB);
      const timeA = buildMedianTimeData(abGroups.groupA, screenOrder) || screenNames.map(() => 0);
      const timeB = buildMedianTimeData(abGroups.groupB, screenOrder) || screenNames.map(() => 0);

      // Funnel
      if (funnelChartRef.current) {
        funnelInstance.current = new Chart(funnelChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A (Video Intro)',
                data: funnelA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B (No Video)',
                data: funnelB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      // Dropoff
      if (dropoffChartRef.current) {
        dropoffInstance.current = new Chart(dropoffChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A Dropoff %',
                data: dropoffA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B Dropoff %',
                data: dropoffB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, max: 100 } },
          },
        });
      }

      // Time
      if (timeChartRef.current) {
        timeInstance.current = new Chart(timeChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A Median seconds',
                data: timeA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B Median seconds',
                data: timeB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }
    } else {
      // Single dataset (original behavior)
      const funnelData = screenNames.map(name => analytics.screenCounts[name] || 0);
      const dropoffData = buildDropoffData(funnelData);
      const medianTimeData = screenNames.map(name =>
        Number(analytics.medianScreenTimes[name] ?? 0).toFixed(1));

      if (funnelChartRef.current) {
        funnelInstance.current = new Chart(funnelChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Users reaching screen',
              data: funnelData,
              backgroundColor: 'rgba(84, 153, 199, 0.7)',
              borderColor: 'rgba(84, 153, 199, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      if (dropoffChartRef.current) {
        dropoffInstance.current = new Chart(dropoffChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Dropoff %',
              data: dropoffData,
              backgroundColor: 'rgba(231, 76, 60, 0.7)',
              borderColor: 'rgba(231, 76, 60, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } },
          },
        });
      }

      if (timeChartRef.current) {
        timeInstance.current = new Chart(timeChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Median seconds',
              data: medianTimeData,
              backgroundColor: 'rgba(46, 204, 113, 0.7)',
              borderColor: 'rgba(46, 204, 113, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }
    }
  }, [sessions, computeAnalytics, splitByAB, showABControls, abGroups, screenOrder, buildFunnelData, buildMedianTimeData]);

  // Conversion breakdown data
  const conversionData = useMemo(() => {
    const buildRow = (label, list) => {
      const total = list.length;
      if (total === 0) return { label, sessions: 0, completed: 0, completionRate: null, medianTime: 0, paywallRate: '0.0' };
      const { completed, completionRate } = completionSummary(list);
      const paywall = list.filter(s => s.reached_paywall === true).length;
      const times = list.map(s => Number(s.total_time_seconds)).filter(value => value > 0);
      return {
        label,
        sessions: total,
        completed,
        completionRate,
        medianTime: times.length > 0 ? median(times).toFixed(0) : 0,
        paywallRate: ((paywall / total) * 100).toFixed(1),
      };
    };

    const rows = [];

    // A/B groups
    if (showABControls) {
      rows.push({ header: 'A/B Group' });
      rows.push(buildRow('Video Intro (A)', abGroups.groupA));
      rows.push(buildRow('No Video (B)', abGroups.groupB));
    }

    // Referral source
    rows.push({ header: 'Referral Source' });
    const referralBuckets = { Instagram: [], TikTok: [], Reddit: [], Friend: [], Other: [] };
    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const source = survey?.referralSource || survey?.referral_source || survey?.how_did_you_hear || '';
      const srcLower = source.toLowerCase();
      if (srcLower.includes('instagram')) referralBuckets.Instagram.push(s);
      else if (srcLower.includes('tiktok')) referralBuckets.TikTok.push(s);
      else if (srcLower.includes('reddit')) referralBuckets.Reddit.push(s);
      else if (srcLower.includes('friend')) referralBuckets.Friend.push(s);
      else referralBuckets.Other.push(s);
    });
    Object.entries(referralBuckets).forEach(([key, list]) => {
      rows.push(buildRow(key, list));
    });

    // Age bracket
    rows.push({ header: 'Age Bracket' });
    const ageBuckets = { '13-17': [], '18-24': [], '25-34': [], '35+': [] };
    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const age = survey?.age || s.age;
      if (age == null) return;
      const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
      if (isNaN(ageNum)) return;
      if (ageNum >= 13 && ageNum <= 17) ageBuckets['13-17'].push(s);
      else if (ageNum >= 18 && ageNum <= 24) ageBuckets['18-24'].push(s);
      else if (ageNum >= 25 && ageNum <= 34) ageBuckets['25-34'].push(s);
      else if (ageNum >= 35) ageBuckets['35+'].push(s);
    });
    Object.entries(ageBuckets).forEach(([key, list]) => {
      rows.push(buildRow(key, list));
    });

    return rows;
  }, [sessions, surveys, abGroups, showABControls]);

  // Survey overview stats
  const surveyOverview = useMemo(() => {
    const total = sessions.length;
    if (total === 0) return null;

    // Referral source counts
    const referralCounts = {};
    // Age counts
    const ageCounts = {};
    // Reason (main issue) counts
    const reasonCounts = {};
    // Screen time distribution
    const screenTimeBuckets = { '0-2h': 0, '2-4h': 0, '4-6h': 0, '6-8h': 0, '8-10h': 0, '10h+': 0 };
    const screenTimeValues = [];
    // Paywall pass-through (reached paywall and didn't drop off there)
    let paywallPassed = 0;
    // Explicitly completed setup; this is not a RevenueCat purchase conversion.
    let converted = 0;

    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;

      // Referral
      const source = survey?.referralSource || survey?.referral_source || survey?.how_did_you_hear || 'Unknown';
      referralCounts[source] = (referralCounts[source] || 0) + 1;

      // Age
      const age = survey?.age || s.age;
      if (age != null) {
        const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
        if (!isNaN(ageNum)) {
          let bracket;
          if (ageNum <= 17) bracket = '13-17';
          else if (ageNum <= 24) bracket = '18-24';
          else if (ageNum <= 34) bracket = '25-34';
          else bracket = '35+';
          ageCounts[bracket] = (ageCounts[bracket] || 0) + 1;
        }
      }

      // Reason
      const reason = survey?.mainIssue || survey?.main_issue || null;
      if (reason) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }

      // Screen time
      const stHours = survey?.screenTimeHours;
      if (stHours != null && !isNaN(stHours)) {
        screenTimeValues.push(Number(stHours));
        if (stHours < 2) screenTimeBuckets['0-2h']++;
        else if (stHours < 4) screenTimeBuckets['2-4h']++;
        else if (stHours < 6) screenTimeBuckets['4-6h']++;
        else if (stHours < 8) screenTimeBuckets['6-8h']++;
        else if (stHours < 10) screenTimeBuckets['8-10h']++;
        else screenTimeBuckets['10h+']++;
      }

      // Continuing into a post-paywall screen is distinct from finishing setup.
      if (passedPaywall(s, screenOrder, paywallScreenForVersion(version))) {
        paywallPassed++;
      }

      // Converted: completed onboarding (didn't drop off)
      if (s.dropped_off === false) {
        converted++;
      }
    });

    return {
      referralCounts,
      ageCounts,
      reasonCounts,
      screenTimeBuckets,
      medianScreenTime: screenTimeValues.length > 0 ? median(screenTimeValues).toFixed(1) : null,
      screenTimeCount: screenTimeValues.length,
      paywallPassed,
      paywallPassRate: ((paywallPassed / total) * 100).toFixed(1),
      converted,
      conversionRate: ((converted / total) * 100).toFixed(1),
    };
  }, [sessions, surveys, screenOrder, version]);

  // Per-answer counts for personalization fields on flows that collect them. Survey docs
  // are per-device latest-state, so without the
  // version gate a re-onboarded device would attribute its answers to old v1-v4 sessions
  const personalizationSurveyBreakdowns = useMemo(() => {
    if (!['v5', 'v6', 'v10', 'v14', 'v17', 'v18'].includes(version)) return [];
    const fields = version === 'v18' ? V18_SURVEY_FIELDS : V5_SURVEY_FIELDS;
    return fields.map(field => {
      const counts = {};
      let answered = 0;
      sessions.forEach(s => {
        const survey = s.device_id ? surveys.get(s.device_id) : null;
        if (version === 'v18' && survey?.onboarding_attempt_id !== s.onboarding_attempt_id) return;
        let value = survey?.[field.key];
        if (value == null && field.fallbackKey) value = survey?.[field.fallbackKey];
        if (value == null || value === '') return;
        const values = Array.isArray(value) ? value : [value];
        if (values.length === 0) return;
        answered++;
        values.forEach(v => {
          const answer = field.bucketScore && typeof v === 'number'
            ? bucketZeroToOne(v)
            : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v);
          counts[answer] = (counts[answer] || 0) + 1;
        });
      });
      return { ...field, counts, answered };
    }).filter(f => f.answered > 0);
  }, [sessions, surveys, version]);

  // Session explorer data
  const sessionExplorerData = useMemo(() => {
    let filtered = sessions.map((s, idx) => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const userData = findSessionUser(s, usersMap);
      const displayName = userData?.displayName || userData?.name || survey?.displayName || '';
      const email = userData?.email || '';
      const abGroup = getABGroup(s);

      const completedScreens = s.screens_completed || [];
      let lastScreen = s.last_screen_name || '--';
      if (s.last_screen_name) {
        const found = screenOrder.find(o => o.name === s.last_screen_name);
        lastScreen = found ? found.label : s.last_screen_name;
      } else if (completedScreens.length > 0) {
        const lastSc = completedScreens[completedScreens.length - 1];
        const found = screenOrder.find(o => o.name === lastSc.screen_name);
        lastScreen = found ? found.label : lastSc.screen_name;
      }

      const startedAt = s.started_at?.toDate ? s.started_at.toDate() : (s.started_at ? new Date(s.started_at) : null);

      return {
        originalIdx: idx,
        session: s,
        date: startedAt,
        displayName,
        email,
        userLabel: displayName || email || 'Anonymous',
        lastScreen,
        totalTime: s.total_time_seconds || 0,
        droppedOff: s.dropped_off,
        abGroup: abGroup || '--',
        survey,
        userData,
        completedScreens,
      };
    });

    // Search filter
    if (sessionSearch.trim()) {
      const q = sessionSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.userLabel.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sessionSortField) {
        case 'date':
          cmp = (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
          break;
        case 'user':
          cmp = a.userLabel.localeCompare(b.userLabel);
          break;
        case 'lastScreen':
          cmp = a.lastScreen.localeCompare(b.lastScreen);
          break;
        case 'totalTime':
          cmp = a.totalTime - b.totalTime;
          break;
        case 'dropoff':
          cmp = (a.droppedOff ? 1 : 0) - (b.droppedOff ? 1 : 0);
          break;
        case 'abGroup':
          cmp = a.abGroup.localeCompare(b.abGroup);
          break;
        default:
          cmp = 0;
      }
      return sessionSortDir === 'desc' ? -cmp : cmp;
    });

    return filtered;
  }, [sessions, usersMap, surveys, getABGroup, screenOrder, sessionSearch, sessionSortField, sessionSortDir]);

  const handleSort = (field) => {
    if (sessionSortField === field) {
      setSessionSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSessionSortField(field);
      setSessionSortDir('desc');
    }
  };

  const revealSelectedVersion = useCallback(node => {
    if (!node) return;
    const container = node.parentElement;
    const offset = node.getBoundingClientRect().left - container.getBoundingClientRect().left;
    container.scrollLeft += offset - (container.clientWidth - node.clientWidth) / 2;
  }, []);

  const sortIndicator = (field) => {
    if (sessionSortField !== field) return '';
    return sessionSortDir === 'desc' ? ' \u25BC' : ' \u25B2';
  };

  const formatDate = (d) => {
    if (!d) return '--';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatSurveyValue = (v) => {
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    if (typeof v === 'number' && !Number.isInteger(v)) return v.toFixed(2);
    if (Array.isArray(v)) return v.join(', ');
    return String(v);
  };

  const analytics = computeAnalytics();

  return (
    <div className={panelMode ? 'analytics-panel' : 'analytics-page'}>
      {!panelMode && (
        <header className="analytics-header">
          <h1>Spool Onboarding Analytics</h1>
          <div className="auth-section">
            {user ? (
              <>
                <span className="user-email">{user.email}</span>
                <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
              </>
            ) : (
              <button className="btn-login" onClick={handleSignIn}>Sign In</button>
            )}
          </div>
        </header>
      )}

      {!user ? (
        !panelMode && (
          <div className="login-prompt">
            <p>Sign in with an authorized Google account to view analytics.</p>
          </div>
        )
      ) : sessionError ? (
        <p role="alert">{sessionError}</p>
      ) : loading ? (
        <div className="loading">Loading sessions...</div>
      ) : (
        <>
          <div className="summary-cards">
            {panelMode && (
              <div className="summary-card">
                <h3>RevenueCat New Customers</h3>
                <span className="value">
                  {revenueCatOverview?.newCustomers != null
                    ? revenueCatOverview.newCustomers.toLocaleString()
                    : '--'}
                </span>
                <span className="card-desc">
                  All flow versions · RevenueCat acquisition count for the selected dates (UTC)
                </span>
              </div>
            )}
            {panelMode && (
              <div className="summary-card">
                <h3>RevenueCat Initial Conversion (7 days)</h3>
                <span className="value">{revenueCatOverview?.initialConversionRate != null
                  ? `${revenueCatOverview.initialConversionRate.toFixed(1)}%` : '--'}</span>
                <span className="card-desc">{revenueCatError ? 'RevenueCat unavailable — retry shortly'
                  : revenueCatLoading ? 'Loading selected dates…'
                  : revenueCatOverview?.initialConversionCustomers != null
                    ? `${revenueCatOverview.initialConversions} converted / ${revenueCatOverview.initialConversionCustomers} new customers · all flows, includes trials`
                    : 'No conversion data for this range'}</span>
              </div>
            )}
            <div className="summary-card">
              <h3>Tracked Sessions</h3>
              <span className="value">{analytics ? analytics.total : '--'}</span>
              <span className="card-desc">Selected flow only · latest record per device</span>
            </div>
            {showsPaywallMetrics && (
              <>
                <div className="summary-card">
                  <h3>Pre-Paywall Dropoff</h3>
                  <span className="value">{analytics ? `${analytics.prePaywallDropoffRate}%` : '--'}</span>
                  <span className="card-desc">Saved as unfinished before the paywall</span>
                </div>
                <div className="summary-card">
                  <h3>Paywall Reach Rate</h3>
                  <span className="value">{analytics ? `${analytics.paywallRate}%` : '--'}</span>
                  <span className="card-desc">Made it to the paywall screen</span>
                </div>
              </>
            )}
            <div className="summary-card">
              <h3>Tracked Setup Completion</h3>
              <span className="value">{analytics ? `${analytics.completionRate}%` : '--'}</span>
              <span className="card-desc">
                {analytics ? `${analytics.completed} completed / ${analytics.total} tracked sessions` : 'No tracked sessions'}
                {analytics?.unknown > 0 ? ` · ${analytics.unknown} unknown` : ''}
              </span>
            </div>
            <div className="summary-card">
              <h3>Median Total Time</h3>
              <span className="value">{analytics ? `${analytics.medianTotalTime}s` : '--'}</span>
              <span className="card-desc">Median time from first screen to last screen seen</span>
            </div>
          </div>

          <p className="metric-definition">
            Setup completion = explicitly completed sessions ÷ all tracked sessions in the selected flow.
            The period rate is weighted by session count; it is not an average of daily percentages.
            Firebase days use your local timezone. Records show the latest saved state, so later completions
            can change an older start-date cohort. RevenueCat uses UTC customer cohorts across all flows
            and measures purchases or trial starts within 7 days; recent cohorts are still maturing.
          </p>

          <div className="chart-container conversion-section">
            <h2>Daily Tracked Setup Completion</h2>
            <table className="conversion-table">
              <thead><tr><th>Start date (local)</th><th>Sessions</th><th>Completed</th><th>Unfinished</th><th>Unknown</th><th>Rate</th></tr></thead>
              <tbody>{dailyCompletion(sessions).map(row => (
                <tr key={row.date}><td>{row.date}</td><td>{row.total}</td><td>{row.completed}</td>
                  <td>{row.unfinished}</td><td>{row.unknown}</td><td>{row.completionRate}%</td></tr>
              ))}</tbody>
              {analytics && <tfoot><tr><th>Total</th><td>{analytics.total}</td><td>{analytics.completed}</td>
                <td>{analytics.unfinished}</td><td>{analytics.unknown}</td><td>{analytics.completionRate}%</td></tr></tfoot>}
            </table>
          </div>

          {/* Survey Overview */}
          {surveyOverview && (
            <div className="survey-overview">
              <h2>Survey Overview</h2>
              <div className="survey-grid">
                <div className="survey-section">
                  <h3>Referral Source</h3>
                  <div className="survey-bars">
                    {Object.entries(surveyOverview.referralCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([source, count]) => (
                        <div key={source} className="survey-bar-row">
                          <span className="survey-bar-label">{source}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill"
                              style={{ width: `${(count / sessions.length) * 100}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({((count / sessions.length) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Main Reason</h3>
                  <div className="survey-bars">
                    {Object.entries(surveyOverview.reasonCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([reason, count]) => (
                        <div key={reason} className="survey-bar-row">
                          <span className="survey-bar-label">{reason}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill reason"
                              style={{ width: `${(count / sessions.length) * 100}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({((count / sessions.length) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Age Breakdown</h3>
                  <div className="survey-bars">
                    {['13-17', '18-24', '25-34', '35+'].map(bracket => {
                      const count = surveyOverview.ageCounts[bracket] || 0;
                      return (
                        <div key={bracket} className="survey-bar-row">
                          <span className="survey-bar-label">{bracket}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill age"
                              style={{ width: `${sessions.length > 0 ? (count / sessions.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(0) : 0}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Screen Time (Self-Reported){surveyOverview.medianScreenTime ? ` — Median: ${surveyOverview.medianScreenTime}h` : ''}</h3>
                  <div className="survey-bars">
                    {Object.entries(surveyOverview.screenTimeBuckets).map(([bucket, count]) => (
                      <div key={bucket} className="survey-bar-row">
                        <span className="survey-bar-label">{bucket}</span>
                        <div className="survey-bar-track">
                          <div
                            className="survey-bar-fill screentime"
                            style={{ width: `${surveyOverview.screenTimeCount > 0 ? (count / surveyOverview.screenTimeCount) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="survey-bar-value">{count} ({surveyOverview.screenTimeCount > 0 ? ((count / surveyOverview.screenTimeCount) * 100).toFixed(0) : 0}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {personalizationSurveyBreakdowns.map((field, fi) => (
                  <div key={field.key} className="survey-section">
                    <h3>{field.label} — {field.answered} answered</h3>
                    <div className="survey-bars">
                      {Object.entries(field.counts)
                        .sort((a, b) => field.bucketScore ? a[0].localeCompare(b[0]) : b[1] - a[1])
                        .map(([answer, count]) => (
                          <div key={answer} className="survey-bar-row">
                            <span className="survey-bar-label">{answer}</span>
                            <div className="survey-bar-track">
                              <div
                                className={`survey-bar-fill ${['', 'reason', 'age', 'screentime'][fi % 4]}`.trim()}
                                style={{ width: `${Math.min((count / field.answered) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="survey-bar-value">{count} ({((count / field.answered) * 100).toFixed(0)}%)</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="survey-section">
                  <h3>Funnel Outcomes</h3>
                  <div className="outcome-stats">
                    {showsPaywallMetrics && (
                      <div className="outcome-row">
                        <span className="outcome-label">Got past paywall</span>
                        <span className="outcome-value">{surveyOverview.paywallPassed} ({surveyOverview.paywallPassRate}%)</span>
                        <span className="outcome-desc">Saw paywall and continued onboarding</span>
                      </div>
                    )}
                    <div className="outcome-row">
                      <span className="outcome-label">Completed onboarding</span>
                      <span className="outcome-value">{surveyOverview.converted} ({surveyOverview.conversionRate}%)</span>
                      <span className="outcome-desc">Explicit setup completion recorded by the app</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="filters">
            {!panelMode && (
              <>
                <label>
                  From:
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                </label>
                <label>
                  To:
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                </label>
                <button className="btn-refresh" onClick={handleRefresh}>Refresh</button>
              </>
            )}

            <div className="version-toggle">
              {[
                // Live-traffic windows: app-release date of the build that
                // introduced the flow → the date the next flow's build shipped.
                { id: 'v1', label: 'Pre-Update (v1)',        dates: '→ Apr 5 ’26',        detail: 'sessions with no flow_version · app ≤3.3' },
                { id: 'v2', label: 'Post-Update (v2)',       dates: 'Apr 5 – Apr 28 ’26', detail: 'app 4.1–4.14 (+ later "unassigned" fallback trickle)' },
                { id: 'v3', label: 'Commitment (v3)',        dates: 'Apr 28 – May 17 ’26', detail: 'app 4.16–4.17' },
                { id: 'v4', label: 'Chat + Journey (v4)',    dates: 'May 17 – Jul 6 ’26',  detail: 'app 4.18' },
                { id: 'v5', label: 'Spooli + Archetype (v5)', dates: 'Jul 6 – ~Jul 22 ’26', detail: 'app 4.20/4.21 · also unassigned legacy-resume fallback traffic after Jul 22' },
                { id: 'v6', label: 'Reels Demo (v6/9)',      dates: '~Jul 22 – Aug 5 ’26', detail: 'reels demo + personalized plan · flow_version 6 & 9, identical flows' },
                { id: 'v10', label: 'App 4.27 (v10)',        dates: 'Aug 5 ’26 → Sep ’26', detail: 'app 4.27 · flow_version 10 · post_purchase_journey_v10' },
                { id: 'v14', label: 'New Carousel (v14)',    dates: '4.32 / main',         detail: 'flow_version 14 · prayer_lock_carousel_v14 + existing_account_setup_v14' },
                { id: 'v17', label: 'Previous (v17)',         dates: 'Sep 21 ’26 → v18',    detail: 'app 4.39 · flow_version 17 · welcome_name_optional_chat_v17' },
                { id: 'v18', label: 'Current (v18)',         dates: 'New onboarding',      detail: 'flow_version 18 · transformation_story_v18' },
              ].map(v => (
                <button
                  key={v.id}
                  ref={version === v.id ? revealSelectedVersion : null}
                  className={`version-btn ${version === v.id ? 'active' : ''}`}
                  onClick={() => setVersion(v.id)}
                  title={v.detail}
                >
                  {v.label}
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 400, opacity: 0.75 }}>
                    {v.dates}
                  </span>
                </button>
              ))}
            </div>

            {version === 'v14' && (
              <div className="version-toggle" aria-label="v14 onboarding cohort">
                {[
                  { id: 'prayer_lock_carousel_v14', label: 'Fresh acquisition' },
                  { id: 'existing_account_setup_v14', label: 'Existing account setup' },
                ].map(cohort => (
                  <button
                    key={cohort.id}
                    className={`version-btn ${v14Cohort === cohort.id ? 'active' : ''}`}
                    onClick={() => setV14Cohort(cohort.id)}
                  >
                    {cohort.label}
                  </button>
                ))}
              </div>
            )}

            {showABControls && (
              <label className="ab-checkbox">
                <input
                  type="checkbox"
                  checked={splitByAB}
                  onChange={e => setSplitByAB(e.target.checked)}
                />
                Split by A/B Group
              </label>
            )}
          </div>

          <div className="chart-container">
            <h2>Onboarding Funnel</h2>
            <canvas ref={funnelChartRef}></canvas>
          </div>

          <div className="chart-container">
            <h2>Dropoff Rate by Screen</h2>
            <canvas ref={dropoffChartRef}></canvas>
          </div>

          <div className="chart-container">
            <h2>Median Time per Screen (seconds)</h2>
            <canvas ref={timeChartRef}></canvas>
          </div>

          {/* Conversion Breakdown Table */}
          <div className="chart-container conversion-section">
            <h2>Tracked Setup Breakdown</h2>
            <table className="conversion-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Sessions</th>
                  <th>Setup Completion</th>
                  <th>Median Time (s)</th>
                  {showsPaywallMetrics && <th>Paywall Rate</th>}
                </tr>
              </thead>
              <tbody>
                {conversionData.map((row, i) => {
                  if (row.header) {
                    return (
                      <tr key={`h-${i}`} className="conversion-header-row">
                        <td colSpan={showsPaywallMetrics ? 5 : 4}>{row.header}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={`r-${i}`}>
                      <td>{row.label}</td>
                      <td>{row.sessions}</td>
                      <td>{row.completionRate == null ? '--' : `${row.completed} / ${row.sessions} (${row.completionRate}%)`}</td>
                      <td>{row.medianTime}</td>
                      {showsPaywallMetrics && <td>{row.paywallRate}%</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Session Explorer */}
          <div className="chart-container session-explorer">
            <h2>Session Explorer</h2>
            <div className="session-search">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={sessionSearch}
                onChange={e => setSessionSearch(e.target.value)}
              />
            </div>
            <div className="session-table-wrapper">
              <table className="session-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} className="sortable">
                      Date{sortIndicator('date')}
                    </th>
                    <th onClick={() => handleSort('user')} className="sortable">
                      User{sortIndicator('user')}
                    </th>
                    <th onClick={() => handleSort('lastScreen')} className="sortable">
                      Last Screen{sortIndicator('lastScreen')}
                    </th>
                    <th onClick={() => handleSort('totalTime')} className="sortable">
                      Total Time (s){sortIndicator('totalTime')}
                    </th>
                    <th onClick={() => handleSort('dropoff')} className="sortable">
                      Setup status{sortIndicator('dropoff')}
                    </th>
                    {showABControls && (
                      <th onClick={() => handleSort('abGroup')} className="sortable">
                        A/B Group{sortIndicator('abGroup')}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sessionExplorerData.slice(0, 200).map((row, i) => {
                    const isExpanded = expandedSessionIdx === row.originalIdx;
                    return (
                      <React.Fragment key={`se-${row.originalIdx}`}>
                        <tr
                          className={`session-row ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => setExpandedSessionIdx(isExpanded ? null : row.originalIdx)}
                        >
                          <td>{formatDate(row.date)}</td>
                          <td>{row.userLabel}</td>
                          <td>{row.lastScreen}</td>
                          <td>{row.totalTime > 0 ? row.totalTime : '--'}</td>
                          <td>{setupStatusLabel(row.session)}</td>
                          {showABControls && <td>{row.abGroup}</td>}
                        </tr>
                        {isExpanded && (
                          <tr className="session-detail-row">
                            <td colSpan={showABControls ? 6 : 5}>
                              <div className="session-detail">
                                {/* Screen timeline */}
                                <div className="detail-section">
                                  <h4>Screen Timeline</h4>
                                  <div className="screen-timeline">
                                    {row.completedScreens.map((sc, j) => {
                                      const screenInfo = screenOrder.find(o => o.name === sc.screen_name);
                                      const ts = sc.completed_at?.toDate ? sc.completed_at.toDate() : null;
                                      return (
                                        <div key={j} className="timeline-item">
                                          <span className="timeline-screen">{screenInfo?.label || sc.screen_name}</span>
                                          <span className="timeline-time">
                                            {sc.time_spent_seconds != null ? `${sc.time_spent_seconds}s` : '--'}
                                          </span>
                                          {ts && (
                                            <span className="timeline-timestamp">
                                              {ts.toLocaleTimeString()}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {row.completedScreens.length === 0 && (
                                      <span className="no-data">No screen data recorded</span>
                                    )}
                                  </div>
                                </div>

                                {/* Survey answers */}
                                {row.survey && (
                                  <div className="detail-section">
                                    <h4>Survey Answers</h4>
                                    <div className="detail-kv">
                                      {(row.survey.referralSource || row.survey.referral_source) && (
                                        <div><strong>Referral:</strong> {row.survey.referralSource || row.survey.referral_source}</div>
                                      )}
                                      {(row.survey.mainIssue || row.survey.main_issue) && (
                                        <div><strong>Main issue:</strong> {row.survey.mainIssue || row.survey.main_issue}</div>
                                      )}
                                      {row.survey.age && (
                                        <div><strong>Age:</strong> {row.survey.age}</div>
                                      )}
                                      {row.abGroup !== '--' && row.survey.ab_showVideoIntro !== undefined && (
                                        <div><strong>A/B Video Intro:</strong> {row.survey.ab_showVideoIntro ? 'Yes' : 'No'}</div>
                                      )}
                                      {V5_SURVEY_FIELDS.map(f => {
                                        let v = row.survey[f.key];
                                        if (v == null && f.fallbackKey) v = row.survey[f.fallbackKey];
                                        if (v == null || v === '') return null;
                                        const archetypeId = f.key === 'archetypeName' && row.survey.archetypeId !== v
                                          ? row.survey.archetypeId : null;
                                        return (
                                          <div key={f.key}>
                                            <strong>{f.label}:</strong> {formatSurveyValue(v)}{archetypeId ? ` (${archetypeId})` : ''}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* User info */}
                                {row.userData && (
                                  <div className="detail-section">
                                    <h4>User Info</h4>
                                    <div className="detail-kv">
                                      {(row.userData.displayName || row.userData.name) && (
                                        <div><strong>Name:</strong> {row.userData.displayName || row.userData.name}</div>
                                      )}
                                      {row.userData.email && (
                                        <div><strong>Email:</strong> {row.userData.email}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {sessionExplorerData.length > 200 && (
                <p className="session-truncated">Showing 200 of {sessionExplorerData.length} sessions</p>
              )}
              {sessionExplorerData.length === 0 && (
                <p className="session-truncated">No sessions found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
