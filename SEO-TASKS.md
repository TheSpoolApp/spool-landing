# Spool SEO / ASO / GEO Task List

## DONE — 20,000-session social preview (2026-08-15)

- [x] Replace the preview badge with `20,000+ sessions blocked`
- [x] Publish a new cache-busting Open Graph image URL
- [x] Update every site metadata reference to the new image
- [x] Verify the production build and generated preview metadata

## DONE — New creator AppsFlyer links (2026-08-15)

- [x] Add Peyton bio attribution (`peyton_bio`)
- [x] Add Peyton DM attribution (`peyton_dm`)
- [x] Add Simon bio attribution (`simon_bio`)
- [x] Add Simon DM attribution (`simon_dm`)
- [x] Verify the four OneLinks against the user's explicit ordered mapping

## DONE — Releases tab refresh from iOS Git (2026-08-05)

- [x] Fetch and merge the latest iOS `origin/main` while preserving the local 4.27 version edit
- [x] Diff the 47 commits after the existing July 24 release-context boundary
- [x] Add the live 4.27 release covering product, onboarding, revenue,
      analytics, and comparison caveats
- [x] Update stale version/flow notes with the user-confirmed live boundary
- [x] Run production build/data-shape/diff checks and review the final diff

Implementation note: the Release tab now labels 4.27 as the current live release from 2026-08-05
and closes the 4.21 live window on that date. The new entry covers the 47-commit delta after July
24: exercise interventions, Snapchat and Apps clarity, blocking status/rule presets, flow v10,
Thread display semantics, churn-save offers, and RevenueCat identity/analytics repairs.

Verification note: targeted module assertions confirm 4.27 sorts first, exports as current/live,
closes 4.21 on 2026-08-05, and reports 47 commits; `git diff --check` passes and the 50-page Next.js
production build succeeds. Scoped ESLint could not run because this checkout has no ESLint 9 flat
configuration file.

## DONE — In-app browser App Store handoff (2026-08-01)

- [x] Audit existing App Store CTAs, the `/ig` route, and available attribution configuration
- [x] Add shared Instagram, Threads, Facebook, Messenger, TikTok, iOS, and Android browser detection
- [x] Route every App Store CTA through a synchronous in-app-browser escape with a manual fallback
- [x] Add a noindex `/get?src=<channel>` social-bio redirect page with neutral attribution fallback
- [x] Ensure every `/get?src=` link opens the App Store rather than the homepage on desktop tests
- [x] Pass 4 helper tests, scoped lint with zero errors, a 50-page production build, and local `/get` smoke checks

Implementation note: the repository contains the live iOS App Store URL and now maps the supplied AppsFlyer OneLinks for Spool, Sean, and Alexis ManyChat/bio traffic. The Android package remains unset because Spool is currently iOS-only.

Verification note: the new flat ESLint setup also exposes older errors in unrelated analytics and legal-page files; those pre-existing issues were not changed as part of this task.

## DONE — Remove competitor backlinks (2026-07-31)

- [x] Remove every outbound link to competitor websites while preserving comparison-keyword text
- [x] Add a permanent editorial rule against competitor backlinks
- [x] Build 49 static pages and verify generated HTML contains zero competitor-domain anchors across all 43 sitemap URLs
- [x] Pushed commit `043f14e` to `main`, confirmed Vercel succeeded, and verified all 43 production sitemap URLs

Editorial correction: competitor names may appear as plain text for comparison relevance, but Spool pages must not link to competitor websites or send them referral authority. Link internally to Spool comparison pages and product pages instead.

## DONE — Product-led comparison rewrite (2026-07-31)

- [x] Re-audit SocialLite, Dull, UNDOOMED, and LoomWeb for the search structures they use—not their wording
- [x] Rewrite the new comparison pages so Spool is the clear recommendation without making unverifiable claims
- [x] Remove templated “choose either app” language and replace it with natural, problem-led copy across all comparison pages
- [x] Tighten the comparison hub and AI-readable summaries around Spool's differentiators
- [x] Build 49 static pages, crawl all 43 sitemap URLs locally, and verify comparison/Focus Web schema
- [x] Pushed commit `322aa61` to `main`, confirmed Vercel succeeded, and crawled all 43 production sitemap URLs

Editorial correction: comparison pages must be honest but product-led. Do not create neutral buyer's guides that actively send qualified Spool visitors to competitors. Lead with the searcher's problem, make Spool's combined filtering + voice-reflection mechanism the recommendation, mention competitor advantages only when required for factual credibility, and end with Spool as the next action.

## DONE — SocialLite + Focus Web category language (2026-07-31)

- [x] Added a verified Spool vs SocialLite comparison page and comparison-hub entry
- [x] Defined Focus Web consistently as Spool's social media feed blocker / distraction-free social media browser
- [x] Rebuilt 49 static pages and verified all 43 sitemap URLs return HTTP 200
- [x] Committed only the SEO scope and pushed `codex/focus-web-seo-sociallite`
- [x] Fast-forwarded the tested SEO commits to `main` to trigger the Vercel production build

## DONE — Focus Web SEO cluster (2026-07-31)

- [x] Added a crawlable Focus Web feature hub with a removed-vs-available platform table
- [x] Added exact-intent pages for Instagram, YouTube, X, and Snapchat
- [x] Added evidence-based Spool vs Dull and Spool vs UNDOOMED comparison pages
- [x] Linked the new cluster from the homepage, comparison hub, footer, sitemap, and AI-readable summaries
- [x] Refreshed existing Instagram, YouTube, and X guides so they describe the shipped product accurately
- [x] Built all static routes and verified all 42 sitemap URLs return HTTP 200

## Google Search Console Issues (from screenshots)

| Issue | Status | Notes |
|-------|--------|-------|
| "Page with redirect" (2 pages) | Not a problem | `http://` and `http://www.` redirect to `https://` — expected behavior |
| "Alternate page with proper canonical" (1 page) | Not a problem | `https://www.` defers to `https://` canonical — expected behavior |
| Hash-based sitemap URLs | FIXED | Replaced static `sitemap.xml` with dynamic `src/app/sitemap.js` |

---

## DONE (this session)

- [x] Replaced static sitemap.xml (had `/#/` hash URLs) with dynamic `src/app/sitemap.js`
- [x] Added `metadataBase: new URL('https://thespoolapp.com')` to root layout
- [x] Added title template (`%s | Spool`) for child pages
- [x] Added canonical URLs to blog post pages
- [x] Created 20-question FAQ section with FAQPage JSON-LD schema
- [x] FAQ grouped into 3 categories (About Spool, Screen Time, Comparisons)
- [x] Cotton candy gradient background applied site-wide
- [x] Glass UI applied to all components
- [x] New Spooli mascot assets swapped in
- [x] Phone mockup welcome screen updated
- [x] Tab favicon updated to spool_final_icon.png
- [x] Sharpened the first-answer intro on the "Best Apps to Stop Doomscrolling in 2026" listicle
- [x] Added ranked ItemList schema for the 10-app doomscrolling listicle
- [x] Rebuilt `/compare` as a crawlable comparison hub with links to all comparison pages
- [x] Fixed missing homepage Open Graph image (`public/og-homepage.jpg`)
- [x] Replaced broken JSON-LD logo references with existing `spooli-app-icon.png`
- [x] Added BreadcrumbList schema to blog and compare detail pages
- [x] Removed duplicated `| Spool | Spool` title tags from child routes
- [x] Added per-post Open Graph metadata to blog detail pages
- [x] Updated public review copy to 120+ global App Store reviews
- [x] Removed hand-maintained homepage aggregate rating markup until reviews are rendered/verifiable
- [x] Removed hidden/inconsistent aggregate rating markup from comparison pages
- [x] Added self canonicals and matching Open Graph URLs/images to secondary pages
- [x] Added compare-specific Open Graph image (`public/og-compare.jpg`)
- [x] Added optimized 512px schema logo asset (`public/spooli-app-icon-512.png`)

---

## QUICK WINS — Do This Week

### Technical SEO
- [ ] Move FAQ JSON-LD schema from client-side `FAQ.js` to server-side `page.js` (crawlers may not see client-rendered schema)
- [ ] Resubmit sitemap in Google Search Console (the old one had broken URLs)
- [x] Create OG image (`public/og-homepage.jpg`, 1200x630px) — currently referenced in metadata but file doesn't exist
- [x] Add Article schema (datePublished, author) to blog post pages
- [x] Add BreadcrumbList schema to blog and compare pages

### Content
- [ ] Fill out `/about` page — founder story, mission, team (currently placeholder)
- [ ] Fill out `/press` page — media kit, key stats, press mentions (currently placeholder)
- [ ] Update `public/llms.txt` — add pricing ($7.99/mo, $39.99/yr), update stats to 8k+ excuses
- [ ] Create `public/llms-full.txt` — expanded version with all FAQ content and comparisons

### ASO (App Store)
- [ ] Change App Store title from "Spool: Save Your Thread" to "Spool: Stop Doomscrolling"
- [ ] Change subtitle to "Screen Time & Phone Detox"
- [ ] Update keyword field: `screen time,doomscrolling,phone addiction,app blocker,digital detox,focus,mindful,scrolling,brainrot`
- [ ] Set up in-app review prompts (SKStoreReviewController) after positive moments

### Distribution
- [ ] Submit to AlternativeTo (as alternative to Opal, One Sec, Freedom, ScreenZen, Brainrot)
- [ ] Submit to Product Hunt (schedule launch)
- [ ] Create G2 product listing
- [ ] Post founder story on Indie Hackers
- [ ] Submit to BetaPage
- [ ] Post genuinely helpful content on Reddit: r/nosurf, r/digitalminimalism, r/productivity

---

## MONTH 1 — Content Calendar

### Week 1
- [ ] Blog: "Phone Addiction Statistics 2026" (data pillar, 2500+ words)
- [ ] Blog: "What is Brainrot? Symptoms, Causes, and How to Fix It" (trending keyword)

### Week 2
- [ ] Blog: "How to Stop Scrolling TikTok" (high-volume long-tail)
- [ ] Blog: "Why App Blockers Don't Work (And What Does)" (positions Spool)

### Week 3
- [ ] Blog: "Digital Detox Guide 2026: Step-by-Step" (pillar, 3000+ words)
- [ ] Compare page: "Spool vs ScreenZen"

### Week 4
- [ ] Compare page: "Spool vs Freedom"
- [ ] Blog: "Screen Time and Mental Health: What the Research Says"

---

## MONTH 2-3 — Long-Term

### More Blog Posts
- [ ] "How to Stop Scrolling Instagram"
- [ ] "Dopamine Detox: Does It Actually Work?" (expand from FAQ)
- [ ] "How I Reduced My Screen Time by 80%" (founder story)
- [ ] "Best Screen Time Apps 2026: Honest Comparison" (own the listicle)
- [ ] "How to Stop Checking Your Phone Compulsively"
- [ ] Compare page: "Spool vs Monk"
- [ ] "The Science Behind Voice Check-Ins" (unique, citable)
- [ ] "ADHD and Phone Addiction: What You Need to Know"
- [ ] Publish "State of Doomscrolling" report with anonymized Spool user data

### Link Building
- [ ] Outreach to 20 "best screen time app" listicle authors requesting inclusion
- [ ] Pitch 3 guest posts to digital wellness blogs
- [ ] Respond to journalist queries on HARO/Connectively
- [ ] Pitch to TechCrunch, Lifehacker, The Verge

### ASO Iteration
- [ ] Redesign App Store screenshots (billboard first, keyword-rich captions)
- [ ] Create preview video showing voice check-in flow
- [ ] Set up Apple Search Ads ($300/mo budget, 4-campaign structure)
- [ ] A/B test screenshots via Product Page Optimization
- [ ] Create Custom Product Pages (TikTok addiction, work focus, digital wellness)

### GEO Ongoing
- [ ] Update llms.txt quarterly with fresh stats
- [ ] Monitor AI chatbot responses monthly ("best screen time app", "stop doomscrolling")
- [ ] Build consistent Reddit presence (2-3 posts/week)
- [ ] Ensure all blog posts use "direct answer" format under question-based H2s

---

## Target Keywords (by priority)

### High Priority (homepage + blog)
| Keyword | Est. Volume | Where to target |
|---------|-------------|-----------------|
| screen time app | 18-22K | Homepage H1/meta |
| how to stop doomscrolling | 8-12K | Blog + FAQ |
| phone addiction | 14-18K | Blog pillar |
| stop doomscrolling | 5-8K | Homepage + blog |
| best screen time app iPhone | 3-5K | Compare hub |
| reduce screen time | 6-9K | Blog |

### Long-Tail (blog posts)
| Keyword | Est. Volume |
|---------|-------------|
| how to stop scrolling TikTok | 1-2K |
| best app to reduce screen time iPhone 2026 | 500-1K |
| screen time app that actually works | 800-1.5K |
| why can't I stop scrolling | 2-3K |
| dopamine detox app iPhone | 1-2K |
| alternative to Opal app | 500-1K |
| Instagram addiction help | 1.5-2.5K |

---

## Key Stats to Use in Content

Checked against live site copy on 2026-10-17. Items marked UNVERIFIED need a fresh
source (App Store Connect, Firestore, or RevenueCat) before they appear in new content.

- 26,000+ excuses (voice check-ins) recorded (matches homepage, commit d2ae5a2)
- $4.99/week or $44.99/year, US prices (matches `PolicyCopy.js` and Terms, updated 2026-10-02)
- Voice check-in takes ~5 seconds
- UNVERIFIED: 4.8 stars on App Store (120+ global reviews)
- UNVERIFIED: download count (old figure: 2,000+)
- UNVERIFIED: 80% avg screen time reduction in first week; 25% sustained long-term reduction
- DO NOT USE: "Verbalizing intentions increases behavior change by 42% (Harvard/Yale)" has no
  traceable source (see SEO-CONTENT-BACKLOG.md E1)
