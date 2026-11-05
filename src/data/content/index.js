import { CONTENT } from './registry';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Formats an ISO 'YYYY-MM-DD' date as 'Month D, YYYY' without going through
// Date/timezone parsing (which shifts date-only ISO strings near UTC midnight).
export function formatDisplayDate(iso) {
  const [y, m, dd] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${dd}, ${y}`;
}

function displayTitle(entry) {
  return entry.card.title || entry.meta.title;
}

function hrefFor(slug, entry) {
  return entry.type === 'compare' ? `/compare/${slug}` : `/blog/${slug}`;
}

// The 5 platform-specific doomscrolling guides get a dedicated cross-link
// block ("Stop scrolling on every platform") in addition to their normal
// Related block — see L1 in SEO-CONTENT-BACKLOG.md.
const PLATFORM_GUIDES = [
  { slug: 'how-to-stop-doomscrolling-on-tiktok', label: 'TikTok' },
  { slug: 'how-to-stop-doomscrolling-on-instagram-reels', label: 'Instagram Reels' },
  { slug: 'how-to-stop-doomscrolling-on-youtube-shorts', label: 'YouTube Shorts' },
  { slug: 'how-to-stop-doomscrolling-on-twitter-x', label: 'X (Twitter)' },
  { slug: 'how-to-stop-doomscrolling-on-reddit', label: 'Reddit' },
];

// Returns the other 4 platform guides (with href) if slug is one of the 5, else null.
export function getPlatformSiblings(slug) {
  if (!PLATFORM_GUIDES.some((p) => p.slug === slug)) return null;
  return PLATFORM_GUIDES.filter((p) => p.slug !== slug).map((p) => ({
    slug: p.slug,
    label: p.label,
    href: `/blog/${p.slug}`,
  }));
}

// Resolves an entry's related[] slugs into {slug, title, href}.
export function getRelatedLinks(slug) {
  const entry = CONTENT[slug];
  if (!entry) return [];
  return entry.related
    .map((relSlug) => {
      const rel = CONTENT[relSlug];
      if (!rel) return null;
      return { slug: relSlug, title: displayTitle(rel), href: hrefFor(relSlug, rel) };
    })
    .filter(Boolean);
}

// For app/blog/[id]/page.js — { [slug]: { title, description, datePublished, dateModified } }
export function getBlogMetaMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    if (entry.type !== 'blog') continue;
    out[slug] = {
      title: entry.meta.title,
      description: entry.meta.description,
      datePublished: entry.meta.datePublished,
      dateModified: entry.meta.dateModified,
    };
  }
  return out;
}

// For app/compare/[id]/page.js — { [slug]: { title, description, date, competitor, faq } }
export function getCompareMetaMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    if (entry.type !== 'compare') continue;
    out[slug] = {
      title: entry.meta.title,
      description: entry.meta.description,
      date: entry.meta.dateModified,
      datePublished: entry.meta.datePublished,
      competitor: entry.meta.competitor,
      competitorOperatingSystem: entry.meta.competitorOperatingSystem,
      faq: entry.meta.faq,
    };
  }
  return out;
}

// For views/BlogPage.js — the /blog index card list, in curated display order.
export function getCardList() {
  return Object.entries(CONTENT).map(([slug, entry]) => ({
    id: slug,
    title: displayTitle(entry),
    excerpt: entry.card.excerpt,
    date: formatDisplayDate(entry.meta.datePublished),
    dateISO: entry.meta.datePublished,
    readTime: entry.card.readTime,
    category: entry.card.category,
    isComparison: entry.type === 'compare',
  }));
}

// Pages that show a visible "Last updated" badge — the listicle + every
// compare page (freshness signaling proven to matter; see E1 in the backlog).
function showsLastUpdated(slug, entry) {
  return entry.type === 'compare' || ['best-apps-stop-doomscrolling-2026', 'how-to-stop-doomscrolling-on-instagram-reels'].includes(slug);
}

// For views/BlogPost.js — shared renderer for both /blog/[id] and /compare/[id].
export function getBlogContentMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    out[slug] = {
      title: displayTitle(entry),
      date: formatDisplayDate(entry.meta.datePublished),
      dateModified: formatDisplayDate(entry.meta.dateModified),
      showLastUpdated: showsLastUpdated(slug, entry),
      readTime: entry.card.readTime,
      category: entry.card.category,
      content: entry.body,
      related: getRelatedLinks(slug),
      platformSiblings: getPlatformSiblings(slug),
    };
  }
  return out;
}

// For app/sitemap.js — real lastModified per URL instead of build-time new Date().
export function getSitemapEntries() {
  const blog = [];
  const compare = [];
  for (const [slug, entry] of Object.entries(CONTENT)) {
    const item = { slug, lastModified: entry.meta.dateModified };
    if (entry.type === 'blog') blog.push(item);
    else compare.push(item);
  }
  return { blog, compare };
}
