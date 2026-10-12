import BlogPage from '@/views/BlogPage';

export const metadata = {
  title: 'Blog — Digital Wellness & Screen Time Research',
  description: 'Original research and head-to-head app comparisons from Spool. Read what 26,000+ voice check-ins reveal about why people doomscroll, plus honest reviews of Opal, One Sec, Freedom, ScreenZen, and more.',
  alternates: { canonical: 'https://www.thespoolapp.com/blog' },
  openGraph: {
    title: 'Blog — Digital Wellness & Screen Time Research | Spool',
    description: 'Original research and head-to-head app comparisons from Spool. Read what 26,000+ voice check-ins reveal about why people doomscroll, plus honest reviews of Opal, One Sec, Freedom, ScreenZen, and more.',
    url: 'https://www.thespoolapp.com/blog',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
  },
};

const FAQS = [
  {
    q: "What's the difference between Spool and other screen-time apps like Opal or One Sec?",
    a: "Spool combines two mechanisms: Focus Web, its social media feed blocker, removes selected distracting feeds inside Instagram, YouTube, X, and Snapchat, while a 5-second voice check-in captures why you tried to open the full native app. Spool's AI then surfaces patterns in those spoken reasons. Traditional blockers, passive delays, and gamified focus apps usually address only access or time.",
  },
  {
    q: 'Does Spool actually reduce screen time?',
    a: 'Yes. Many users see a sharp drop in screen time during the first week, with meaningful reductions sustained over the long term. Some have gone from several hours of daily phone use to a fraction of that.',
  },
  {
    q: 'How does the voice check-in work?',
    a: 'When you tap a designated distracting app — TikTok, Instagram, X, YouTube, Reddit — Spool intercepts the launch and asks you to speak your reason in 5 seconds. The app then opens. Over time, Spool\'s AI analyzes the spoken statements and surfaces patterns like "you said \'just checking\' 47 times this week."',
  },
  {
    q: 'What apps does Spool work with?',
    a: 'Spool works with any iOS app or website you designate. Users typically set it on Instagram, TikTok, X (Twitter), YouTube, Reddit, and news apps. You choose which apps trigger the check-in.',
  },
  {
    q: 'Is Spool just another app blocker?',
    a: 'No. Focus Web can remove individual social-media surfaces without blocking the whole platform, and the voice check-in addresses why you reached for the native app. Spool combines content filtering with reflection instead of relying on one all-or-nothing block.',
  },
  {
    q: 'Is Spool available on Android?',
    a: 'Not yet. Spool is iPhone-only as of 2026; Android is in development.',
  },
  {
    q: 'How much does Spool cost?',
    a: 'Standard US prices in USD: US$4.99 billed every week or US$44.99 billed once per year. Standard subscriptions have no free trial. Prices and taxes may vary by country or offer; exact terms appear before App Store purchase confirmation.',
  },
];

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://www.thespoolapp.com/blog',
  url: 'https://www.thespoolapp.com/blog',
  name: 'The Spool Blog',
  description: 'Digital-wellness research, app comparisons, and practical guides on stopping doomscrolling — drawn from 26,000+ voice check-ins from Spool users.',
  publisher: {
    '@type': 'Organization',
    name: 'Spool',
    url: 'https://www.thespoolapp.com',
    logo: { '@type': 'ImageObject', url: 'https://www.thespoolapp.com/spooli-app-icon-512.png' },
  },
  author: {
    '@type': 'Person',
    name: 'Prafull Sharma',
    url: 'https://www.linkedin.com/in/prafull-sharma-363187168/',
    jobTitle: 'Founder, Spool',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BlogPage faqs={FAQS} />
    </>
  );
}
