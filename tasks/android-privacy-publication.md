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

## Publication result

### Authenticated continuation

- User confirms Vercel sign-in. Re-read rules, lessons, tracking and Git state; latest main remains `69a47e7ec4186e0ab53df3ca0a068bfc091f6071` with a clean working tree.
- Existing project/dashboard confirms Production is still `30cfc7a`; connected Git repository is displayed as `prafull2001/spool-landing`, the old repository location. Inspect connection and deploy latest main without changing domains or replacing hosting.
- Git settings explicitly report “Error: Project Link not found.” No deploy hooks exist. Reconnect the existing project's Git source to the transferred repository, then deploy current main and check production.
- Reconnect produced no change. Removed the unusable Git connection through Vercel's confirmation; project settings/configuration are preserved. Current account's chooser exposes only `jainam-m02` repositories. Add GitHub Scope produced no new browser tab or organization. Automatic Git connection remains unresolved; try CLI publication to the same existing project without changing GitHub permissions.
- User reports enabling/selecting the Spool group and authorizes correcting it if needed. Confirmed Git remote is `TheSpoolApp/spool-landing`; recheck the chooser and prefer restoring Git deployment now that access may be available.
- Refreshed Git chooser still lists only `jainam-m02`. Vercel CLI 63.1.2 installed through npm's temporary execution cache; normal device authorization opened in the signed-in account, but Allow Access is disabled. No CLI auth or deployment success is assumed.
- User completes device authorization and provides success screenshot. CLI exits successfully with “Congratulations! You are now signed in.” Link explicitly to existing team `neals-projects-2fc8a4e7`, project `prj_fl2cEfvFQlfGe90OPoj25sTGcgp9` / `spool-landing`, then publish current main.
- CLI whoami is `loyaltylens-5552`, unlike the dashboard's `spoolappteam-2783`. Explicit link fails “The specified scope does not exist.” Check available teams before any retry; do not create or deploy to a replacement project.
- CLI teams list confirms only `loyaltylens`. Started a separate deployment-only auth configuration in a mode-700 temporary directory, preserving the user's personal CLI session. Asked the user to authorize this new request specifically as `spoolappteam-2783` / the existing hosting account. Vercel displays the correct request details, but Allow Access stays disabled in agent browser controls.
- User requests another retry. Session checks confirm the second CLI authorization succeeded, but whoami is again `loyaltylens-5552`. Browser's consumed code now reports timeout. Recheck current team membership and direct access to the known project ID before requesting any further authentication.
- Fresh read-only CLI retry still lists only `loyaltylens`; direct inspect of the existing Spool project ID returns `project_not_found`. UI Git-settings navigation is slow and its subsequent DOM snapshot fails with a CDP focus-emulation timeout; try accessibility observation before any new login or mutation.
- User explicitly asks to connect the normal repository. Focus on `TheSpoolApp/spool-landing` through the existing Vercel Git integration; leave the CLI path alone. Rechecked chooser still has only `jainam-m02`. Opening the organization's Installed GitHub Apps page times out and resets CUA; inspect inventory before continuing, because creation outcome is unknown.
- Recovery inventory has no browsers. The existing-tab lookup returns “Browser is not available: 2”; URL-based recovery returns “No browser is available.” Browser reconnection is now an external blocker; no organization/app permission or replacement connection was changed during this retry.
- Concrete remaining connection action: in existing project's Git settings, Add GitHub Scope for `TheSpoolApp` with repository access limited to `spool-landing`, select that namespace and Connect the repository. Current chooser cannot select it because it only exposes `jainam-m02`. Do not start another unrelated CLI login.
- October 12, 12:09 PM PDT status check: latest main is `6a1a003`; all three signed-out public URLs still serve the old content (privacy dated October 2, neither required anchor, support has neither new link). Last recorded Vercel Production is still `30cfc7a`. Browser inventory remains empty, so any manual connection repair cannot be inspected. Make one fresh main tracking commit/push to trigger the existing integration if restored, then verify actual checks/deployment/public content.

- Source update committed and pushed directly to `main`: `176bcd09ce127b803a4617cf6fe75b797b4acba2`. `git ls-remote` confirms the remote SHA. Feature branch was not pushed before main.
- New commit's GitHub checks/statuses are empty and no new Vercel Production deployment is recorded. A push is not deployment verification.
- Canonical public pages still lack the changes; no new deployed commit or working public Android/deletion section can be reported yet.
- Existing Vercel sign-in tab is retained for user handoff. No hosting migration or replacement site was created.
- This task remains incomplete: authenticated Vercel publication, signed-out post-deploy checks/screenshots, operator retention decisions and end-to-end deletion verification are outstanding.

## Sources

- Android main at `7dddb38` and current `SpoolAuth.kt`, `SpoolAnalytics.kt`, Accessibility service XML/service, backend and data-safety inventory.
- Live Firebase metadata APIs for `spool-a5020`, checked October 12: database/version history, backup schedules, per-collection TTL configuration, functions and logging bucket retention. No production records modified or customer data retrieved.
- [ML Kit Android disclosure](https://developers.google.com/ml-kit/android-data-disclosure).
- [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data).
- [PostHog event retention](https://posthog.com/docs/data/events-retention) and [data deletion](https://posthog.com/docs/privacy/data-storage#data-deletion); live Spool organization/project settings via connector.
- [RevenueCat customer deletion](https://www.revenuecat.com/docs/dashboard-and-metrics/customer-profile#delete-customer). RevenueCat's controller privacy policy's six-year rule is not evidence for Spool's end-user processor retention.
