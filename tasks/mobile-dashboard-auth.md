# Mobile weekly-dashboard sign-in

October 14, 2026. Screenshot shows Firebase missing initial state on iPhone Chrome before the weekly report can load.

- [x] Inspect fresh main, shared Firebase sign-in, and live Google/Firebase configuration.
- [x] Verify current auth helper is cross-origin, local `/__/auth/iframe` is 404, and the website OAuth callback is rejected with redirect_uri_mismatch.
- [x] Proxy Firebase helpers on the canonical website, retain iframe access only from same origin, and exclude auth callbacks from pageview tracking.
- [x] Use same-origin redirect on mobile, retain popup desktop behavior, and expose retryable sign-in errors/loading state.
- [x] Test auth orchestration and proxy behavior; build and check mobile/desktop UI and protected weekly endpoint.
- [ ] Confirm Google OAuth callback registration, deploy to main, and verify production. Do not activate the new auth domain while Google rejects it.

External prerequisite: add `https://www.thespoolapp.com/__/auth/handler` to existing web OAuth client `1063005040926-m72futno5e80oekt4hvt2b92hf1s83os.apps.googleusercontent.com`. Firebase already authorizes www.thespoolapp.com. No existing URI, provider, user, or access list should be removed. User asked while implementation proceeds.

The screenshot alone does not identify whether the initial-state loss was partitioning, a changed browser/tab, or cleared session storage. Same-origin authentication removes the verified cross-origin boundary; a real iPhone Google-account completion remains necessary.


## Verification notes

- Baseline main: d2ae5a2; production Vercel status succeeds and the weekly API rejects signed-out access with 401.
- Live Firebase read-only configuration confirms www.thespoolapp.com is already an authorized domain and Google sign-in is enabled. No identity settings or users were changed.
- Google OAuth comparison: existing firebaseapp callback reaches sign-in; website callback returns redirect_uri_mismatch. No interactive login or customer-account actions performed.
- 71 tests pass, including mobile/desktop sign-in choice, blocked storage, popup cancellation/fallback, fixed-origin proxy allowlist, credential-header isolation, POST forwarding, no caching and fail-closed errors.
- Existing weekly dashboard browser suite passes with fixture authentication and aggregate data; real endpoint rejects absent/invalid tokens. No production auth bypass exists.
- Initial external-rewrite check found missing response headers; replaced with a fixed-upstream GET/POST route that explicitly sets no-store and same-origin framing. Final browser checks follow.

- Final production build and focused lint pass. Live-upstream local proxy checks return 200 for handler/iframe/iframe.js with no-store, SAMEORIGIN and no-referrer; ordinary dashboard still has DENY and weekly API still requires auth.
- Browser integration checks pass: mobile same-tab navigation targets the same-origin handler and preserves tab/from/to; blocked sessionStorage remains on the dashboard with a visible error; blocked desktop popup gets visible retry guidance and an enabled retry button. Screenshots reviewed at 390×844 and 1440×1000. OAuth navigation was intercepted before Google; this is not a real-user Google-login certification.
- Release remains blocked on the exact OAuth callback registration. Keep this change off main until a signed-out probe no longer reports redirect_uri_mismatch, then merge with a fresh main commit and verify deployment. A real iPhone account sign-in is the final acceptance check.

References: https://firebase.google.com/docs/auth/web/redirect-best-practices (same-origin auth helpers), https://firebase.google.com/docs/auth/web/google-signin (mobile redirect and getRedirectResult).
