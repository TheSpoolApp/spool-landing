import { getSitemapEntries } from '@/data/content';

export default function sitemap() {
  const baseUrl = 'https://www.thespoolapp.com';
  const { blog: blogPosts, compare: comparePages } = getSitemapEntries();
  // Hub pages change whenever one of their posts does.
  const latest = (items) => items.map((i) => i.lastModified).sort().at(-1);

  return [
    { url: baseUrl, lastModified: '2026-10-17', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: latest(blogPosts), changeFrequency: 'weekly', priority: 0.9 },
    ...blogPosts.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/compare`, lastModified: latest(comparePages), changeFrequency: 'weekly', priority: 0.8 },
    ...comparePages.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/focus-web`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/focus-web/instagram-without-reels`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/youtube-without-shorts`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/x-without-explore`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/snapchat-without-spotlight`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/science`, lastModified: '2026-08-15', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/authors/prafull`, lastModified: '2026-08-15', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/press`, lastModified: '2026-07-31', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/support`, lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: '2026-10-12', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.3 },
  ];
}
