import { getSitemapEntries } from '@/data/content';
import { FOCUS_WEB_PLATFORMS } from '@/data/focusWeb';

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
    { url: `${baseUrl}/focus-web`, lastModified: '2026-11-04', changeFrequency: 'monthly', priority: 0.9 },
    ...FOCUS_WEB_PLATFORMS.map(({ slug, dateModified }) => ({
      url: `${baseUrl}/focus-web/${slug}`,
      lastModified: dateModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/science`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/authors/prafull`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/press`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/support`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
