import BlogPost from '@/views/BlogPost';
import { notFound } from 'next/navigation';
import { PRAFULL } from '@/data/authors';
import { getBlogMetaMap } from '@/data/content';

const AUTHOR = {
  name: PRAFULL.name,
  url: PRAFULL.url,
  jobTitle: PRAFULL.jobTitle,
  sameAs: PRAFULL.sameAs,
};

const blogMeta = getBlogMetaMap();

const DOOMSCROLLING_APP_RANKINGS = [
  {
    position: 1,
    name: 'Spool',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#spool',
    approach: 'AI voice check-ins',
    bestFor: 'Understanding why you scroll',
  },
  {
    position: 2,
    name: 'Opal',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#opal',
    approach: 'Hard blocking and focus sessions',
    bestFor: 'Strict distraction-free work periods',
  },
  {
    position: 3,
    name: 'One Sec',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#one-sec',
    approach: 'Breathing exercise pause',
    bestFor: 'Quick friction before opening apps',
  },
  {
    position: 4,
    name: 'ScreenZen',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#screenzen',
    approach: 'Delay timers and usage limits',
    bestFor: 'Gradual habit reduction',
  },
  {
    position: 5,
    name: 'Freedom',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#freedom',
    approach: 'Cross-device blocking',
    bestFor: 'Blocking on phone and desktop',
  },
  {
    position: 6,
    name: 'Brainrot',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#brainrot',
    approach: 'Brain avatar decay',
    bestFor: 'Visual motivation',
  },
  {
    position: 7,
    name: 'Unrot',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#unrot',
    approach: 'Earn screen time via healthy habits',
    bestFor: 'Building healthy habits alongside screen limits',
  },
  {
    position: 8,
    name: 'Monk',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#monk',
    approach: 'Complete a task before unlocking',
    bestFor: 'Maximum discipline enforcement',
  },
  {
    position: 9,
    name: 'Forest',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#forest',
    approach: 'Virtual focus trees',
    bestFor: 'Gamified focus sessions',
  },
  {
    position: 10,
    name: 'RepsForReels',
    url: 'https://www.thespoolapp.com/blog/best-apps-stop-doomscrolling-2026#repsforreels',
    approach: 'Exercise to earn screen time',
    bestFor: 'Combining fitness with screen limits',
  },
];

const BEST_APPS_ITEMLIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best apps to stop doomscrolling in 2026',
  description: 'A ranked comparison of 10 doomscrolling and screen-time apps by mechanism, pricing, and best use case.',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: DOOMSCROLLING_APP_RANKINGS.length,
  itemListElement: DOOMSCROLLING_APP_RANKINGS.map((app) => ({
    '@type': 'ListItem',
    position: app.position,
    url: app.url,
    name: app.name,
    item: {
      '@type': 'SoftwareApplication',
      name: app.name,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS',
      description: `${app.name}: ${app.approach}. Best for ${app.bestFor.toLowerCase()}.`,
    },
  })),
};

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Stop Doomscrolling: 10 Proven Strategies',
  description: 'Ten science-backed steps to break the doom scrolling habit, from understanding triggers to building accountability.',
  totalTime: 'PT2W',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Understand why you doom scroll', text: 'Identify your triggers — boredom, anxiety, FOMO, habit, avoidance — before trying to change the behavior.' },
    { '@type': 'HowToStep', position: 2, name: 'Create friction before opening apps', text: 'Add a pause between urge and action. Move social apps off your home screen, log out after each session, or use a voice-check-in app like Spool.' },
    { '@type': 'HowToStep', position: 3, name: 'Set specific phone-free times', text: 'Designate periods as phone-free — first hour after waking, meals, last hour before bed, focused work.' },
    { '@type': 'HowToStep', position: 4, name: 'Replace scrolling with intentional activities', text: 'Have ready alternatives — a book for boredom, breathing for anxiety, direct messages for connection.' },
    { '@type': 'HowToStep', position: 5, name: 'Use grayscale mode', text: 'Switch your phone to grayscale in accessibility settings. Color is a major attention driver; removing it reduces app appeal.' },
    { '@type': 'HowToStep', position: 6, name: 'Turn off non-essential notifications', text: 'Keep only calls and texts from close contacts. Disable social and news app alerts entirely.' },
    { '@type': 'HowToStep', position: 7, name: 'Practice one-more-scroll awareness', text: 'When you catch yourself scrolling, pause and ask: "What am I looking for?" Usually nothing — that\'s the loop.' },
    { '@type': 'HowToStep', position: 8, name: 'Set smart time limits', text: 'Start with generous app limits, review usage weekly, focus on specific apps, celebrate reductions over punishing overages.' },
    { '@type': 'HowToStep', position: 9, name: 'Find accountability', text: 'Share goals with a friend, use accountability features in screen-time apps, or join a digital-wellness community.' },
    { '@type': 'HowToStep', position: 10, name: 'Be compassionate with yourself', text: 'Don\'t catastrophize setbacks. Notice patterns without judgment. Apps are engineered to be addictive — struggling is normal.' },
  ],
};

export async function generateStaticParams() {
  return Object.keys(blogMeta).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!Object.hasOwn(blogMeta, id)) return {};
  const meta = blogMeta[id];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://www.thespoolapp.com/blog/${id}` },
    openGraph: {
      title: `${meta.title} | Spool`,
      description: meta.description,
      url: `https://www.thespoolapp.com/blog/${id}`,
      type: 'article',
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified,
      authors: [AUTHOR.name],
      images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  if (!Object.hasOwn(blogMeta, id)) notFound();
  const meta = blogMeta[id];

  const articleSchema = meta && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
      jobTitle: AUTHOR.jobTitle,
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spool',
      logo: { '@type': 'ImageObject', url: 'https://www.thespoolapp.com/spooli-app-icon-512.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.thespoolapp.com/blog/${id}` },
  };

  const includeHowTo = id === 'how-to-stop-doom-scrolling';
  const includeBestAppsItemList = id === 'best-apps-stop-doomscrolling-2026';
  const breadcrumbSchema = meta && {
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
        name: 'Blog',
        item: 'https://www.thespoolapp.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.title,
        item: `https://www.thespoolapp.com/blog/${id}`,
      },
    ],
  };

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {includeBestAppsItemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BEST_APPS_ITEMLIST_SCHEMA) }}
        />
      )}
      {includeHowTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }}
        />
      )}
      <BlogPost id={id} />
    </>
  );
}
