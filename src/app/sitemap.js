import { getSitemapEntries } from '@/data/content';

export default function sitemap() {
  const baseUrl = 'https://www.thespoolapp.com';
  const { blog: blogPosts, compare: comparePages } = getSitemapEntries();

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    ...blogPosts.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/compare`, changeFrequency: 'weekly', priority: 0.8 },
    ...comparePages.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/focus-web`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/focus-web/instagram-without-reels`, lastModified: '2026-10-17', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/youtube-without-shorts`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/x-without-explore`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/focus-web/snapchat-without-spotlight`, lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/science`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/authors/prafull`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/press`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/support`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
