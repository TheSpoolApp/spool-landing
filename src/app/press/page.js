import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/views/BlogPost.css';
import { PRESS_ITEMS } from '@/data/press';

const CANONICAL = 'https://www.thespoolapp.com/press';

export const metadata = {
  title: 'Press Coverage',
  description:
    'Published coverage of Spool — including The Daily Cardinal on founder Prafull Sharma and We Are Founders on what 8,667 voice check-ins reveal about the moment people reach for their phones.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Spool Press Coverage',
    description:
      'Published coverage of Spool — including The Daily Cardinal on founder Prafull Sharma and We Are Founders on what 8,667 voice check-ins reveal about the moment people reach for their phones.',
    url: CANONICAL,
    siteName: 'Spool',
    images: [{ url: 'https://www.thespoolapp.com/og-press.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

const pressSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  url: CANONICAL,
  name: 'Spool press coverage',
  itemListElement: PRESS_ITEMS.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'NewsArticle',
      headline: item.title,
      author: item.authors.map((name) => ({ '@type': 'Person', name })),
      publisher: { '@type': 'Organization', name: item.outlet, url: item.outletUrl },
      datePublished: item.datePublished,
      url: item.url,
      description: item.description,
    },
  })),
};

function formatByline(authors) {
  if (authors.length === 1) return authors[0];
  return `${authors.slice(0, -1).join(', ')} and ${authors[authors.length - 1]}`;
}

export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }}
      />
      <Header />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <Link href="/" className="back-to-blog">← Back to Home</Link>
          <span className="blog-post-category">Press</span>
          <h1>Spool in the press</h1>
          <div className="blog-post-meta">
            <span>Published coverage of Spool and its research data</span>
          </div>
        </div>

        <div className="blog-post-content">
          <p>
            Coverage of Spool, its founder, and the voice check-in research behind it —
            sometimes drawing on our anonymized check-in data. For interviews, data questions,
            or assets, email <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>.
          </p>

          {PRESS_ITEMS.map((item) => (
            <section key={item.slug} id={item.slug}>
              <p>
                <span className="blog-post-category">{item.outlet}</span>
              </p>
              <h2>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h2>
              <p>
                <strong>By {formatByline(item.authors)}</strong>. {item.dateDisplay}.
              </p>
              <p>{item.description}</p>
            </section>
          ))}
        </div>

        <div className="blog-post-cta">
          <h3>Curious where the data comes from?</h3>
          <p>The voice check-in corpus builds on peer-reviewed affect labeling research.</p>
          <Link href="/science" className="blog-cta-button">
            Read the science behind Spool
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
