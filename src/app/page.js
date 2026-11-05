import HomePage from '@/views/HomePage';

export const metadata = {
  // `absolute` opts out of the root layout's `%s | Spool` template so the
  // homepage title isn't rendered as "…Screen Time App | Spool" (duplicate brand).
  title: { absolute: 'Spool — Block Reels & Shorts on iPhone' },
  description: 'Block Instagram Reels, Facebook Reels hubs, and YouTube Shorts inside Spool’s Focus Web browser on iPhone. Keep useful social features and add voice check-ins.',
};

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `if (location.hash === '#/terms' || location.hash === '#/privacy') location.replace(location.hash.slice(1));` }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Spool",
            "operatingSystem": "iOS",
            "applicationCategory": "LifestyleApplication",
            "description": "iPhone screen time app with voice check-ins and Focus Web: filter Instagram Reels, Facebook Reels hubs, YouTube Shorts, and Snapchat Stories inside Spool.",
            "url": "https://www.thespoolapp.com",
            "image": "https://www.thespoolapp.com/og-homepage-20k.jpg",
            "offers": [
              {
                "@type": "Offer",
                "price": "4.99",
                "priceCurrency": "USD",
                "eligibleRegion": "US",
                "description": "Standard US subscription price; prices and taxes may vary by country or offer. Exact terms appear before App Store purchase confirmation. No standard free trial.",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "4.99",
                  "priceCurrency": "USD",
                  "unitText": "WEEK",
                  "billingDuration": "P1W"
                }
              },
              {
                "@type": "Offer",
                "price": "44.99",
                "priceCurrency": "USD",
                "eligibleRegion": "US",
                "description": "Standard US subscription price; prices and taxes may vary by country or offer. Exact terms appear before App Store purchase confirmation. No standard free trial.",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "44.99",
                  "priceCurrency": "USD",
                  "unitText": "YEAR",
                  "billingDuration": "P1Y"
                }
              }
            ],
            "downloadUrl": "https://apps.apple.com/us/app/spool-screen-time-control/id6749428484",
            "applicationSubCategory": "Screen Time Management"
          })
        }}
      />
      <HomePage />
    </>
  );
}
