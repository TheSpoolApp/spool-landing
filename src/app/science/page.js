import Link from 'next/link';
import { DownloadLink } from '@/components/DownloadLink/DownloadLink';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/views/BlogPost.css';
import { PAPERS } from '@/data/research';
import { PRAFULL } from '@/data/authors';

const CANONICAL = 'https://www.thespoolapp.com/science';

export const metadata = {
  title: { absolute: 'The Science Behind Spool: Research Foundation' },
  description:
    'Spool operationalizes peer-reviewed research from UCLA, Stanford, NYU, Yale, Harvard, and UC Irvine. The papers on affect labeling, mindfulness and craving, and digital addiction that the product is built on.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'The Science Behind Spool — Research Foundation',
    description:
      'Spool operationalizes peer-reviewed research from UCLA, Stanford, NYU, Yale, Harvard, and UC Irvine. The papers on affect labeling, mindfulness and craving, and digital addiction that the product is built on.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
  },
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: CANONICAL,
  name: 'The Science Behind Spool',
  description:
    'Peer-reviewed research that Spool operationalizes: affect labeling (Lieberman 2007, Tabibnia 2025), mindfulness and craving (Elwafi & Brewer 2013, Schuman-Olivier 2020), and digital addiction (Allcott, Gentzkow & Song 2022).',
  author: {
    '@type': 'Person',
    name: PRAFULL.name,
    url: PRAFULL.url,
  },
  about: PAPERS.map((paper) => ({
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    name: paper.title,
    author: paper.authors,
    datePublished: String(paper.year),
    publisher: paper.journal,
    url: paper.url,
    ...(paper.doi ? { sameAs: [`https://doi.org/${paper.doi}`] } : {}),
    ...(paper.doi ? { identifier: `doi:${paper.doi}` } : {}),
  })),
};

export default function SciencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <Link href="/blog" className="back-to-blog">← Back to Blog</Link>
          <span className="blog-post-category">Research</span>
          <h1>The science behind Spool</h1>
          <div className="blog-post-meta">
            <span>Peer-reviewed research the product is built on</span>
          </div>
        </div>

        <div className="blog-post-content">
          <p>
            Spool is not a wellness app with a vibe. The product is a direct
            implementation of three lines of peer-reviewed research: affect labeling
            (naming an urge reduces its intensity), mindfulness and craving (observing an
            urge breaks the urge-to-action loop), and the welfare economics of digital
            addiction (brief, well-placed friction produces lasting reductions in use).
          </p>

          <p>
            This page lists the specific papers each component of Spool draws on, the
            institutions the work came from, and how the finding maps to a feature in the
            app. Every paper here is publicly available — links go to the original
            source.
          </p>

          {PAPERS.map((paper, index) => (
            <section key={paper.slug} id={paper.slug}>
              <h2>
                {index + 1}. {paper.title}
              </h2>
              <p>
                <strong>{paper.authors}</strong> ({paper.year}).{' '}
                <em>{paper.journal}</em>. {paper.institution}.
                <br />
                {paper.doi ? (
                  <>
                    DOI:{' '}
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {paper.doi}
                    </a>
                  </>
                ) : (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {paper.url}
                  </a>
                )}
              </p>

              <h3>What the paper showed</h3>
              <p>{paper.summary}</p>

              <h3>How Spool uses it</h3>
              <p>{paper.spoolMapping}</p>
            </section>
          ))}

          <h2>What we are not claiming</h2>
          <p>
            Citing a paper as the inspiration for a product feature is not the same as
            claiming the paper&apos;s authors endorse the product, or that the product itself
            has been validated by them. None of the researchers cited above have evaluated
            Spool. We use their published findings as the design rationale for the
            mechanism; the responsibility for whether the implementation actually delivers
            on that mechanism is ours.
          </p>

          <h2>What Spool has measured so far</h2>
          <p>
            Across 8,000+ recorded voice check-ins captured at the moment of compulsive
            phone use, approximately 85% of users frame the unlock as a first-person want
            or need (&ldquo;I just want to scroll for a bit,&rdquo; &ldquo;I just need to
            check something&rdquo;). Surfacing those patterns back to the user is what
            users report drives their behavior change. We treat these as observational
            findings from product data, not as a clinical study.
          </p>
        </div>

        <div className="blog-post-cta">
          <h3>Want to feel the mechanism, not read about it?</h3>
          <p>Spool is the affect-labeling finding turned into a 5-second iPhone interaction.</p>
          <DownloadLink
            className="blog-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Spool on iPhone
          </DownloadLink>
        </div>
      </article>
      <Footer />
    </>
  );
}
