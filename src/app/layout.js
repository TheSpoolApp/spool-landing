import { Quicksand } from 'next/font/google';
import '../index.css';
import { Analytics } from '@vercel/analytics/react';
import MotionProvider from '../components/MotionProvider';
import { DownloadLinkProvider } from '../components/DownloadLink/DownloadLink';
import { PRESS_ITEMS } from '../data/press';

const quicksand = Quicksand({ subsets: ['latin'], display: 'swap', variable: '--font-quicksand' });

export const metadata = {
  metadataBase: new URL('https://www.thespoolapp.com'),
  title: {
    default: 'Spool — Stop Doomscrolling | Screen Time App for iPhone',
    template: '%s | Spool',
  },
  description: 'Spool pairs AI voice check-ins with Focus Web, a social media feed blocker and distraction-free browser for iPhone.',
  openGraph: {
    title: 'Spool — Stop Doomscrolling',
    description: 'Spool pairs AI voice check-ins with Focus Web, a social media feed blocker and distraction-free browser for iPhone.',
    url: 'https://www.thespoolapp.com',
    siteName: 'Spool',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@the_spool_app', creator: '@prafull_truffle' },
  alternates: { canonical: 'https://www.thespoolapp.com' },
  icons: {
    icon: '/spooli-app-icon.png',
    apple: '/apple-touch-icon.png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${quicksand.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.thespoolapp.com/#spool",
              "name": "Spool",
              "alternateName": ["Spool App", "Spool: Screen Time Control"],
              "url": "https://www.thespoolapp.com",
              "logo": "https://www.thespoolapp.com/spooli-app-icon-512.png",
              "description": "Spool is an iPhone screen time app with AI voice check-ins and Focus Web, a social media feed blocker and distraction-free browser.",
              "foundingDate": "2024",
              "founder": [
                {
                  "@type": "Person",
                  "@id": "https://prafullsharma.me/#prafull-sharma",
                  "name": "Prafull Sharma",
                  "jobTitle": "Co-founder",
                  "url": "https://prafullsharma.me",
                  "sameAs": [
                    "https://www.linkedin.com/in/prafull-sharma-363187168/",
                    "https://github.com/prafull2001"
                  ]
                },
                {
                  "@type": "Person",
                  "name": "Jainam Manot",
                  "jobTitle": "Co-founder",
                  "url": "https://www.linkedin.com/in/jainam-manot/",
                  "sameAs": [
                    "https://www.linkedin.com/in/jainam-manot/",
                    "https://x.com/jainam_manot",
                    "https://www.instagram.com/jainam_manot/",
                    "https://www.tiktok.com/@jainam_manot"
                  ]
                },
                {
                  "@type": "Person",
                  "name": "Neal Shah",
                  "jobTitle": "Co-founder",
                  "url": "https://www.linkedin.com/in/nealmshah/",
                  "sameAs": ["https://www.linkedin.com/in/nealmshah/"]
                }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "team@thespoolapp.com",
                "contactType": "customer support"
              },
              "sameAs": [
                "https://twitter.com/the_spool_app",
                "https://www.instagram.com/spool.screentime.app/",
                "https://www.tiktok.com/@spool.screentime.app",
                "https://www.linkedin.com/company/spooli/",
                "https://github.com/prafull2001/spool-landing",
                "https://apps.apple.com/us/app/spool-screen-time-control/id6749428484",
                "https://microlaunch.net/p/spool"
              ],
              "subjectOf": PRESS_ITEMS.map(item => ({
                "@type": "NewsArticle",
                "headline": item.title,
                "author": item.authors.map(name => ({ "@type": "Person", "name": name })),
                "publisher": { "@type": "Organization", "name": item.outlet, "url": item.outletUrl },
                "datePublished": item.datePublished,
                "url": item.url
              }))
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.thespoolapp.com",
              "name": "Spool"
            })
          }}
        />
      </head>
      <body className={quicksand.className}>
        <DownloadLinkProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </DownloadLinkProvider>
        <Analytics />
      </body>
    </html>
  );
}
