# Android privacy and account deletion publication

Date: October 12, 2026

## Plan

- [x] Read rules and lessons; fetch latest main and inspect `81c2baa441e7c66bae8b2d6682630f6a20935df5`.
- [x] Preserve latest main (`887fdcb237100dd62a2ca29565c4fb90365110f0`), existing iOS and refund disclosures, and current styling.
- [x] Verify Android disclosures and account-deletion behavior against current app/backend source.
- [ ] Verify actual retention settings and provider policies; document unresolved facts without invented deadlines.
- [x] Complete source-backed privacy/deletion/support updates; unresolved operator/provider periods remain explicit.
- [x] Verify production build, links, mobile and desktop layout.
- [ ] Publish through the existing host and verify public signed-out routes, deployment commit and screenshots.

## Initial findings

- Latest main already contains the requested commit and a newer prominence/style update.
- Public anchors and support links exist; retention wording currently gives no actual periods.
- Existing hosting appears to be Vercel; confirm project linkage and production status before publishing.
- Live privacy/support are still the older content. Latest main has no GitHub status checks. Vercel CLI has no saved login and the browser is signed out; deployment authentication may be a blocker.
- Android source confirms Firebase account/profile/history/friends removal and a retained `accounts_to_delete` cleanup request. Other providers/analytics are not deleted by that flow.
- Asked the owner for an established retention schedule while checking live settings. No deadline will be invented.
- Offline locked dependency installation failed on an uncached tarball; retry with network using the supported bundled Node runtime.
- Locked network dependency installation passed (554 packages); manifest/lockfile unchanged.
- Read-only live Firebase configuration: PITR disabled; Firestore version retention 3,600 seconds (one hour); no backup schedules; Cloud Logging `_Default` retention 30 days and `_Required` audit retention 400 days. TTL listing needs a retry without optional pageSize after an explicit API rejection.
- PostHog active project belongs to Spool; replay retention is 30 days, while Android replay is disabled in source. Event retention cannot be inferred from replay retention or the project payload.
- TTL checks succeeded for `accounts_to_delete`, `_serverSubscriptionAnalyticsEvents`, `_serverRefundEvidence` and `_serverRefundConsents`: no TTL configurations returned.
- Deployed `hello_world` source (Google Cloud source object generation `1786767846159878`, updated August 15) uses OpenAI Chat Completions and includes request-body logging. Inspected source in memory only; no keys, source archive or customer records copied to deliverables.
- Official OpenAI API controls describe up-to-30-day default abuse-log retention, with legal/safety exceptions. Account-specific controls remain unverified; no zero-retention claim added.
- Preserved support's prominent Google Play management/deletion links and exact email subject; preserved iOS ATT and Apple refund sections.
- Production build passed with Next.js 16.2.3 and bundled Node 24; 51 pages generated. Focused ESLint and diff whitespace checks passed (existing stale Browserslist notice only).
- Byte-for-byte preservation assertions passed for existing iOS ATT, Information Sharing/Apple refund copy, shared PolicyCopy, Terms, support page, CSS, manifest and lockfile.
- Public GitHub deployment records confirm last Vercel Production deployment: `30cfc7a8deb1e04e97e993f802bd5b9558feba58`, October 3, success. Latest main has zero checks/statuses. October 8 github-pages deployment is a different environment, not proof for the canonical Vercel site.

## Verification and review

- Local production server: `/privacy` and `/support` HTTP 200; Android/deletion/retention anchors and exact mailto subject present.
- Browser cases at measured 1280×720 and 390×844: Android anchor, deletion anchor and support. No horizontal overflow; headings approximately 96px below the viewport top; support's two account-help links are visible in the first mobile viewport. Actual support-to-deletion click succeeds. Screenshots visually reviewed.
- Google Play help, management target, ML Kit disclosure, OpenAI API controls and PostHog event-retention links return HTTP 200. The management target correctly leads signed-out visitors to Google sign-in, separate from requesting Spool deletion.
- Signed-out canonical public checks: `/privacy#android`, `/privacy#delete-account` and `/support` return HTTP 200, but privacy is still October 2 and has neither anchor; support has neither new link. Server identifies as Vercel. Publication is not established.
- Screenshot/results directory: `/Users/prafullsharma/.codex/visualizations/2026/10/12/01a13150-2653-7671-a1cc-882b36ed7af3/android-privacy-publication`.

## Unresolved facts / release limitations

- Owner has been asked for the actual manual retention schedule and deletion-request handling process; no answer yet. Source/configuration cannot establish an undocumented operator schedule.
- Retention periods still unconfirmed for support messages, Spool's manual cleanup/billing/refund/consent records, RevenueCat/store copies, and Spool's actual PostHog event plan. No generic vendor period has been substituted for actual settings.
- OpenAI organization-specific controls and device-selected speech-provider retention are not verified. Published default API rules are labeled as defaults, not a confirmed custom account setting.
- No real customer account was deleted, no downstream erasure test was run, and no support/customer messages were sent. Website-only checks do not establish end-to-end deletion.
- Vercel CLI has no login and the browser is signed out. Asked the user to sign in to the existing account; no permission or hosting changes made.

## Sources

- Android main at `7dddb38` and current `SpoolAuth.kt`, `SpoolAnalytics.kt`, Accessibility service XML/service, backend and data-safety inventory.
- Live Firebase metadata APIs for `spool-a5020`, checked October 12: database/version history, backup schedules, per-collection TTL configuration, functions and logging bucket retention. No production records modified or customer data retrieved.
- [ML Kit Android disclosure](https://developers.google.com/ml-kit/android-data-disclosure).
- [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data).
- [PostHog event retention](https://posthog.com/docs/data/events-retention) and [data deletion](https://posthog.com/docs/privacy/data-storage#data-deletion); live Spool organization/project settings via connector.
- [RevenueCat customer deletion](https://www.revenuecat.com/docs/dashboard-and-metrics/customer-profile#delete-customer). RevenueCat's controller privacy policy's six-year rule is not evidence for Spool's end-user processor retention.
