# Weekly usage analysis

## Production availability follow-up (October 10, 2026)

- [x] Re-read rules, lessons, tracking and Git state; record missing production verification.
- [ ] Check the live dashboard/API, deployment status and cofounder access path against current main.
- [ ] Fix the verified cause or repush a fresh main commit as needed.
- [ ] Confirm the production route/bundle/API after deployment and report any remaining authenticated-session limitation.

Confirmed production mismatch: canonical `www.thespoolapp.com/analytics?tab=weekly-usage` returns 200, but `/api/analytics/weekly-usage` returns 404 on both domain forms. Remote main still includes the feature; its latest commit has no deployment statuses. The most recent GitHub Production deployment points to pre-feature commit `30cfc7a` (October 3). Preparing a fresh main push while checking the deployment integration. No access-list changes are warranted by this evidence.

## Push to main (authorized October 9, 2026)

- [x] Re-read project rules, lessons, tracking, and branch state.
- [x] Reconcile with current remote main, commit the tested feature, and push directly to main before publishing the SHA on any feature branch.
- [x] Verify the remote main commit; report deployment status separately from Git push success.

Rebased cleanly onto `30cfc7a`, preserving four newer main commits. Re-ran all 59 tests, production build, and desktop/mobile browser suite successfully. Feature commit `773d7aa62a2172dc30f39e18599d3b8de05a25dd` pushed directly to main; remote SHA verified with `git ls-remote`. Production deployment completion has not been checked.

## Web app integration (requested follow-up)

- [x] Re-read rules, lessons, tracking, and Git state; record destination correction.
- [x] Inspect existing auth/data/cache/UI patterns and select the smallest reliable integration.
- [x] Add weekly cohort graph/table with explicit refresh, loading/error/empty states, and reuse/caching for fast repeat visits.
- [x] Test aggregation and backend/data loading, including refresh failures and cohort edge cases.
- [x] Run browser visual/interaction checks at desktop and mobile sizes; build and document results.

Updated scope: implement in the existing web app. Reuse its authentication and charting; preserve honest requested-unlock labels. Do not expose raw user records in the graph or add production credentials to the repository.

Implementation: dedicated `weekly-usage` dashboard tab and Next.js read-only API. Existing Firebase login is verified upstream before the shared dashboard allowlist or any cached report is used. Two projected Firestore reads at one readTime replace the existing page's full documents and per-account background reads. Return aggregate-only data; five-minute warm-process and per-user session caches, explicit force refresh, request deduplication, bounded timeouts, stale-result preservation. No new runtime dependencies or server credential configuration. Global date filters are hidden for this lifetime-relative view. Shared team IDs/allowlist/config retain existing callers.

Initial validation: 12 aggregation/backend tests passed, covering exclusions, week boundaries, missingness, complete cohorts, authorization, cache expiry, force refresh, concurrent request deduplication, read failures, and REST decoding. Synthetic 30,000-event computation ~330 ms; expanded verification is recorded below.

Final verification (October 9, 2026):

- `npm test`: 54 passing tests, including 13 new calculation/backend tests. Changed files pass ESLint; `git diff --check` passes.
- Production build succeeds and registers `/api/analytics/weekly-usage` as a dynamic server route.
- Live read-only Firestore test exercises the exact projected query/decoding path: 30,542 events, 5,603 ms fetch, 45 ms aggregation, 2,347-byte aggregate response. The JS aggregation matches the independent Python result on the original 30,533-record snapshot. Live Firebase Auth returns `INVALID_ID_TOKEN` for a bad token, confirming the configured REST auth endpoint is reachable.
- Browser tests on the production build at 1440×1100 and 390×844: sign-in gate; actual HTTP rejection of absent/invalid tokens; graph/table; tab and reload cache reuse (~235 ms cached revisit); manual refresh loading/disabled state; new timestamp on success; retained report/error on failure; retry; empty results; malformed responses and corrupted-cache recovery; automatic refresh of stale cache; no page overflow or uncaught browser errors.
- Browser success/auth responses use fixtures (aggregate values from the live read); no real admin session was impersonated or used. Live database access was verified separately with existing local credentials, without printing or adding them to the repo.
- Visually inspected desktop, mobile, refresh-failure, and empty-state screenshots. Shortened the mobile y-axis title, wrapped week labels, and improved refresh-button contrast after inspection.
- Final-build browser suite also passes using the harness's default synthetic fixture; cached revisit measured 551 ms (235 ms in the live-aggregate fixture run). Final screenshots from the live-aggregate fixture are saved under `/Users/prafullsharma/.codex/visualizations/2026/10/09/01a121bd-c883-77e2-ab8d-b191b743b0d7/weekly-usage-web-qa/`. Local production server is running on port 3100 for review.

Re-run: start the built app on port 3100, then `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/weekly-usage-browser.mjs` (installed Chrome required). The harness creates synthetic data by default; `WEEKLY_USAGE_FIXTURE` can point at an aggregate report JSON. No fixture auth bypass exists in app code.

Delivery: branch `codex/weekly-usage-analytics`, route `/analytics?tab=weekly-usage`. No production deployment or Firestore writes. Fresh reads remain history scans, bounded by timeouts; the five-minute server cache is per warm process, complemented by a per-user tab-session cache. Cold instances still require the measured initial fetch. Metric is requested unlock minutes, not measured total screen time.

- [x] Read project rules, lessons, tracking files, and Git state.
- [x] Verify source data for actual screen time, timestamped unlock minutes, and engagement.
- [x] Define engagement without selecting users by their improvement; compare matched users across completed weeks and show sample sizes/missingness.
- [x] Create a one-off graph/table of the available requested-unlock metric with accurate labels; measured screen-time change is unavailable from these sources.
- [x] Verify calculations and document limitations.

Scope: reuse existing analytics/research sources; do not change collection, production data, or deployments. Existing research export already requires at least one excuse for its outcome CSV, but compares self-reported baseline with requested minutes rather than measured screen time.

Findings (2026-10-09): read-only live Firestore retrieval found 30,533 excuse records, with durationMinutes on 19,082; earliest recorded duration is June 12, 2026. No centralized daily screen-time history found in inspected schema/report code. Raw IDs remain in a restricted temporary file, not deliverables. Produce a one-off PNG/table with aggregate data; no dashboard or deployment changes.

Cohorts fixed before examining outcomes: at least 1, 3 (primary), or 5 excuse-active UTC days in EACH of the first three completed seven-day windows, anchored to first recorded excuse day. Exclude known team IDs and explicit sandbox users; require a positive finite duration on every excuse in all three weeks. Same users in each point; mean requested minutes per calendar day, never labeled measured screen time. Cohort sizes: 105 / 63 / 40. Primary cohort excludes 27 otherwise-engaged users for incomplete durations. Stronger engagement criteria select sustained users and can exclude successful users who stop needing unlocks; this is descriptive, not causal.

Delivered local artifacts in `/Users/prafullsharma/.codex/visualizations/2026/10/09/01a121bd-c883-77e2-ab8d-b191b743b0d7/spool-weekly-usage/`: weekly-usage.png, report.html, summary.json, analyze.py. Primary requested minutes/day: 34.7 → 31.6 → 31.8; week-3 change −8.3%, paired difference −2.88 min/day (bootstrap 95% interval −8.53 to +2.42). Five-day cohort increases 10.9%; production-only sensitivity preserves mixed direction. Thus these observations do not establish a screen-time reduction or validate the explanation for the professors’ result.

Validation: assert-based fixtures cover week boundaries, incomplete weeks, missing/invalid durations, known team/sandbox exclusion, cohort eligibility, paired changes, and bootstrap pairing; independently matched the initial aggregation; visually inspected the PNG. No production changes or deployment; professors’ analysis itself was not reviewed.
