import BlogPost from '@/views/BlogPost';
import { PRAFULL } from '@/data/authors';
import { getCompareMetaMap } from '@/data/content';

const compareMeta = getCompareMetaMap();

export async function generateStaticParams() {
  return Object.keys(compareMeta).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const meta = compareMeta[id];
  if (!meta) {
    return { title: 'Compare' };
  }
  return {
    // Skip the "| Spool" template when the title already names the brand.
    title: /Spool/.test(meta.title) ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: `https://www.thespoolapp.com/compare/${id}` },
    openGraph: {
      title: `${meta.title} | Spool`,
      description: meta.description,
      url: `https://www.thespoolapp.com/compare/${id}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const meta = compareMeta[id];

  const articleSchema = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: meta.description,
        datePublished: meta.datePublished,
        dateModified: meta.date,
        author: {
          '@type': 'Person',
          name: PRAFULL.name,
          url: PRAFULL.url,
          jobTitle: PRAFULL.jobTitle,
          sameAs: PRAFULL.sameAs,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Spool',
          url: 'https://www.thespoolapp.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.thespoolapp.com/spooli-app-icon-512.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.thespoolapp.com/compare/${id}`,
        },
        about: [
          {
            '@type': 'SoftwareApplication',
            name: 'Spool',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'iOS',
            offers: [
              {
                '@type': 'Offer',
                price: '4.99',
                priceCurrency: 'USD',
                eligibleRegion: 'US',
                description: 'Standard US subscription price; prices and taxes may vary by country or offer. Exact terms appear before App Store purchase confirmation. No standard free trial.',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '4.99',
                  priceCurrency: 'USD',
                  unitText: 'WEEK',
                  billingDuration: 'P1W',
                },
              },
              {
                '@type': 'Offer',
                price: '44.99',
                priceCurrency: 'USD',
                eligibleRegion: 'US',
                description: 'Standard US subscription price; prices and taxes may vary by country or offer. Exact terms appear before App Store purchase confirmation. No standard free trial.',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '44.99',
                  priceCurrency: 'USD',
                  unitText: 'YEAR',
                  billingDuration: 'P1Y',
                },
              },
            ],
          },
          {
            '@type': 'SoftwareApplication',
            name: meta.competitor,
            applicationCategory: 'HealthApplication',
            operatingSystem: meta.competitorOperatingSystem || 'iOS',
          },
        ],
      }
    : null;

  const faqSchema = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      }
    : null;
  const breadcrumbSchema = meta
    ? {
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
          {
            '@type': 'ListItem',
            position: 3,
            name: meta.title,
            item: `https://www.thespoolapp.com/compare/${id}`,
          },
        ],
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <BlogPost />
    </>
  );
}
