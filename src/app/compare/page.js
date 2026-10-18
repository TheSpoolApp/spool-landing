import { FOCUS_WEB_LIMITS } from '@/components/PolicyCopy';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import styles from './page.module.css';

export const metadata = {
  title: 'Compare Screen Time Apps',
  description: 'Compare Spool with SocialLite, Dull, UNDOOMED, Opal, One Sec, and other screen-time apps. See why Spool combines feed blocking with behavior change.',
  alternates: { canonical: 'https://www.thespoolapp.com/compare' },
  openGraph: {
    title: 'Compare Screen Time Apps | Spool',
    description: 'Ranked, honest comparisons of iPhone screen-time apps by mechanism: awareness, hard blocking, passive friction, and gamification.',
    url: 'https://www.thespoolapp.com/compare',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-compare.jpg', width: 1200, height: 630 }],
  },
};

const COMPARISONS = [
  {
    href: '/compare/spool-vs-sociallite',
    title: 'Spool vs SocialLite',
    competitor: 'SocialLite',
    mechanism: 'Feed blocking plus behavior change',
    summary: 'SocialLite cleans up the feed. Spool does that, then catches the impulse with a voice check-in and turns your reasons into useful patterns.',
  },
  {
    href: '/compare/spool-vs-dull',
    title: 'Spool vs Dull',
    competitor: 'Dull',
    mechanism: 'Root-cause insight vs more toggles',
    summary: 'Dull changes what appears on screen. Spool changes the screen and helps you understand why you kept reaching for it.',
  },
  {
    href: '/compare/spool-vs-undoomed',
    title: 'Spool vs UNDOOMED',
    competitor: 'UNDOOMED',
    mechanism: 'Intent data vs filter count',
    summary: 'UNDOOMED counts filters and screen time. Spool removes the high-impact feeds and captures the reason behind each compulsive open.',
  },
  {
    href: '/compare/spool-vs-opal',
    title: 'Spool vs Opal',
    competitor: 'Opal',
    mechanism: 'Awareness vs hard blocking',
    summary: 'Opal locks apps. Spool helps you stop needing the lock by interrupting the urge and showing you the pattern behind it.',
  },
  {
    href: '/compare/spool-vs-one-sec',
    title: 'Spool vs One Sec',
    competitor: 'One Sec',
    mechanism: 'Voice check-in vs breathing pause',
    summary: 'Spool captures why you scroll; One Sec creates a silent pause before opening apps.',
  },
  {
    href: '/compare/spool-vs-apple-screen-time',
    title: 'Spool vs Apple Screen Time',
    competitor: 'Apple Screen Time',
    mechanism: 'Active reflection vs dismissible limits',
    summary: 'Apple tracks time; Spool interrupts the moment of impulse with a spoken reason.',
  },
  {
    href: '/compare/spool-vs-freedom',
    title: 'Spool vs Freedom',
    competitor: 'Freedom',
    mechanism: 'iPhone awareness vs cross-device blocking',
    summary: 'Freedom blocks across devices. Spool focuses on the everyday iPhone habit and the reason behind each compulsive open.',
  },
  {
    href: '/compare/spool-vs-screenzen',
    title: 'Spool vs ScreenZen',
    competitor: 'ScreenZen',
    mechanism: 'Voice awareness vs delay timers',
    summary: 'ScreenZen makes you wait; Spool makes you articulate why you opened the app.',
  },
  {
    href: '/compare/spool-vs-brainrot',
    title: 'Spool vs Brainrot',
    competitor: 'Brainrot',
    mechanism: 'Awareness vs guilt-based gamification',
    summary: 'Brainrot motivates with a decaying avatar; Spool builds insight from your spoken reasons.',
  },
  {
    href: '/compare/spool-vs-forest',
    title: 'Spool vs Forest',
    competitor: 'Forest',
    mechanism: 'Impulse intervention vs focus timer',
    summary: 'Forest runs focus timers. Spool intervenes at the exact moment you reach for a distracting app.',
  },
  {
    href: '/compare/spool-vs-jomo',
    title: 'Spool vs Jomo',
    competitor: 'Jomo',
    mechanism: 'Targeted filters + reflection vs broad toolkit',
    summary: 'Jomo adds a wellness program. Spool keeps the intervention focused: clean the feed, name the urge, see the pattern.',
  },
  {
    href: '/compare/spool-vs-unrot',
    title: 'Spool vs Unrot',
    competitor: 'Unrot',
    mechanism: 'Verbalized intent vs earned screen time',
    summary: 'Unrot makes you earn access; Spool helps you understand why you wanted access.',
  },
  {
    href: '/compare/spool-vs-clearspace',
    title: 'Spool vs Clearspace',
    competitor: 'Clearspace',
    mechanism: 'Voice check-in vs exercise-based unlocking',
    summary: 'Clearspace adds heavier friction; Spool keeps the pause short and insight-rich.',
  },
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Spool screen time app comparisons',
  description: 'Comparison pages for screen-time and doomscrolling apps that compete with or complement Spool.',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: COMPARISONS.length,
  itemListElement: COMPARISONS.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://www.thespoolapp.com${item.href}`,
    name: item.title,
    description: item.summary,
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.thespoolapp.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Compare',
      item: 'https://www.thespoolapp.com/compare',
    },
  ],
};

export default function ComparePage() {
  return (
    <>
    <Header />
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Screen time app comparisons</p>
        <h1>Compare the best apps to stop doomscrolling</h1>
        <p className={styles.lede}>
          Most screen-time apps attack one piece of the problem. Spool handles two:
          Focus Web removes the feeds that trap you, and a 5-second voice check-in
          interrupts the impulse that brought you there.
        </p>
      </section>

      <section className={styles.summary} aria-labelledby="compare-summary-heading">
        <h2 id="compare-summary-heading">Quick answer</h2>
        <p>
          <strong>Spool is the strongest fit for iPhone users who want to stop
          doomscrolling without giving up social media.</strong> Filter-only tools can
          clean the page but leave the habit untouched. Hard blockers can lock the app
          but teach you nothing about the urge. Spool removes distracting feeds and
          captures why you tried to open the full app, so the intervention keeps working
          after novelty and willpower wear off.
        </p>
      </section>

      <section className={styles.grid} aria-label="Spool comparison pages">
        {COMPARISONS.map((comparison) => (
          <article key={comparison.href} className={styles.card}>
            <p className={styles.mechanism}>{comparison.mechanism}</p>
            <h2>
              <Link href={comparison.href}>{comparison.title}</Link>
            </h2>
            <p>{comparison.summary}</p>
            <Link className={styles.cardLink} href={comparison.href}>
              Read the comparison
            </Link>
          </article>
        ))}
      </section>

      <section className={styles.listicle} aria-labelledby="best-apps-heading">
        <div>
          <h2 id="best-apps-heading">Need the full ranked list?</h2>
          <p>
            Our 2026 listicle ranks 10 doomscrolling apps by what they actually change:
            access, friction, motivation, or the habit itself. Spool ranks first because
            it combines a cleaner feed with active reflection.
          </p>
        </div>
        <Link className={styles.primaryLink} href="/blog/best-apps-stop-doomscrolling-2026">
          See the ranked list
        </Link>
      </section>

      <p className={styles.finePrint}>{FOCUS_WEB_LIMITS}</p>
    </main>
    </>
  );
}
