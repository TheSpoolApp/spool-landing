import HomePage from '@/views/HomePage';

export const metadata = {
  // `absolute` opts out of the root layout's `%s | Spool` template so the
  // homepage title isn't rendered as "…Screen Time App | Spool" (duplicate brand).
  title: { absolute: 'Spool — Stop Doomscrolling | iPhone Screen Time App' },
  description: 'Spool pairs AI voice check-ins with Focus Web, a browser that filters supported social website features inside Spool on iPhone. Native social apps are unchanged.',
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
            "description": "AI-powered screen time app that uses voice check-ins to help you stop doomscrolling and build mindful phone habits",
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
            "downloadUrl": "https://apps.apple.com/us/app/spool-save-your-thread/id6749428484",
            "applicationSubCategory": "Screen Time Management"
          })
        }}
      />
      <HomePage />
    </>
  );
}
