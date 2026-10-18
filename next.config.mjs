import createMDX from '@next/mdx'
import { CONTENT } from './src/data/content/registry.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ]
    }]
  },
  async redirects() {
    return [
      // Resolve known article aliases before rendering to preserve a single Location header.
      ...Object.entries(CONTENT).map(([slug, { type }]) => ({
        source: `/${type === 'blog' ? 'compare' : 'blog'}/${slug}`,
        destination: `/${type}/${slug}`,
        permanent: true,
      })),
      {
        source: '/blog/how-to-stop-doomscrolling-on-instagram-reels-without-quitting',
        destination: '/blog/how-to-stop-doomscrolling-on-instagram-reels',
        permanent: true,
      },
      { source: '/age-cohort',  destination: '/analytics?tab=age-cohort',  permanent: false },
      { source: '/excuse-data', destination: '/analytics?tab=excuse-data', permanent: false },
    ];
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
