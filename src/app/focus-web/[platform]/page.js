import { FOCUS_WEB_LIMITS } from '@/components/PolicyCopy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { DownloadLink } from '@/components/DownloadLink/DownloadLink';
import { FOCUS_WEB_PLATFORMS, getFocusWebPlatform } from '@/data/focusWeb';
import styles from '../focus-web.module.css';

export function generateStaticParams() {
  return FOCUS_WEB_PLATFORMS.map(({ slug }) => ({ platform: slug }));
}

export async function generateMetadata({ params }) {
  const { platform: slug } = await params;
  const item = getFocusWebPlatform(slug);
  if (!item) return { title: 'Focus Web' };

  const url = `https://www.thespoolapp.com/focus-web/${item.slug}`;
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.title} | Spool`,
      description: item.description,
      url,
      images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function FocusWebPlatformPage({ params }) {
  const { platform: slug } = await params;
  const item = getFocusWebPlatform(slug);
  if (!item) notFound();

  const url = `https://www.thespoolapp.com/focus-web/${item.slug}`;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thespoolapp.com' },
      { '@type': 'ListItem', position: 2, name: 'Focus Web', item: 'https://www.thespoolapp.com/focus-web' },
      { '@type': 'ListItem', position: 3, name: item.title, item: url },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${item.shortLabel} on iPhone`,
    step: item.details.map((detail, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: detail,
    })),
  };

  return (
    <>
      <Header />
      <main className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />

        <header className={styles.hero}>
          <Link className={styles.backLink} href="/focus-web">
            ← All Focus Web filters
          </Link>
          <p className={styles.eyebrow}>Spool Focus Web for {item.platform}</p>
          <h1>{item.title}</h1>
          <p className={styles.lede}>{item.description}</p>
          <DownloadLink
            className={styles.primaryLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Spool on iPhone
          </DownloadLink>
        </header>

        <section className={styles.answer} aria-labelledby="quick-answer">
          <h2 id="quick-answer">Quick answer</h2>
          <p>{item.answer}</p>
        </section>

        <section className={styles.twoColumn} aria-label={`${item.platform} Focus Web details`}>
          <article>
            <h2>What Spool can remove</h2>
            <ul>
              {item.removes.map((surface) => <li key={surface}>{surface}</li>)}
            </ul>
          </article>
          <article>
            <h2>What remains available</h2>
            <p>{item.available}</p>
          </article>
        </section>

        <section className={styles.explainer}>
          <h2>Why an app limit misses the real problem</h2>
          <p>{item.problem}</p>
          <p>
            Apple Screen Time can limit or block all of {item.platform}, but it cannot remove
            only the specific feeds and tabs listed above. Focus Web changes the experience
            inside Spool so the useful parts can stay without leaving the main scroll trap
            one tap away.
          </p>

          <h2>How to use {item.shortLabel}</h2>
          <ol>
            {item.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ol>
        </section>

        <section className={styles.faq} aria-labelledby="platform-faq-heading">
          <h2 id="platform-faq-heading">Questions about {item.shortLabel}</h2>
          <dl>
            {item.faq.map(({ q, a }) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className={styles.related} aria-label="Other Focus Web platform guides">
          <h2>Remove distracting feeds on other platforms</h2>
          <ul>
            {FOCUS_WEB_PLATFORMS.filter(({ slug: otherSlug }) => otherSlug !== item.slug).map((other) => (
              <li key={other.slug}>
                <Link href={`/focus-web/${other.slug}`}>{other.shortLabel}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.cta}>
          <h2>Keep the platform. Remove the part that pulls you in.</h2>
          <DownloadLink target="_blank" rel="noopener noreferrer">
            Download Spool for iPhone
          </DownloadLink>
        </section>

        <p className={styles.finePrint}>{FOCUS_WEB_LIMITS}</p>
      </main>
      <Footer />
    </>
  );
}
