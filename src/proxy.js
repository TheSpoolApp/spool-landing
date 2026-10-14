import { NextResponse } from 'next/server'

const STATIC_EXT = /\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|mjs|map|woff|woff2|ttf|otf|eot|txt|xml|json)$/i

const ALLOWLIST_EXACT = new Set([
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/sitemap.xml',
  '/ai.txt',
])

function isAllowlisted(pathname) {
  if (ALLOWLIST_EXACT.has(pathname)) return true
  if (pathname.startsWith('/sitemap-') && pathname.endsWith('.xml')) return true
  if (pathname.startsWith('/.well-known/')) return true
  return false
}

function shouldSkip(pathname) {
  // OAuth callback parameters must never be sent to pageview analytics.
  if (pathname.startsWith('/__/auth/')) return true
  if (isAllowlisted(pathname)) return false
  if (pathname.startsWith('/api/')) return true
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')) return true
  if (pathname === '/favicon.ico' || pathname === '/manifest.webmanifest') return true
  if (STATIC_EXT.test(pathname)) return true
  return false
}

function trackArrivl(request) {
  const websiteKey = process.env.ARRIVL_WEBSITE_KEY
  if (!websiteKey) return
  const xff = request.headers.get('x-forwarded-for') || ''
  const ip = xff.split(',')[0].trim()
  const params = new URLSearchParams({
    url: request.url,
    userAgent: request.headers.get('user-agent') || '',
    ref: request.headers.get('referer') || '',
    ip,
    websiteKey,
  })
  fetch(`https://arrivl.ai/api/v1/intake/pageview?${params.toString()}`).catch(() => {})
}

export async function proxy(request) {
  const { pathname } = request.nextUrl

  if (!shouldSkip(pathname)) {
    trackArrivl(request)

    const accept = request.headers.get('accept') || ''
    if (accept.includes('text/markdown') && pathname !== '/llms-full.txt' && pathname !== '/llms.txt') {
      try {
        const r = await fetch(`${request.nextUrl.origin}/llms-full.txt`, {
          headers: { 'user-agent': 'spool-proxy/1.0' },
        })
        if (r.ok) {
          const body = await r.text()
          return new NextResponse(body, {
            status: 200,
            headers: {
              'content-type': 'text/markdown; charset=utf-8',
              'x-spool-markdown-source': '/llms-full.txt',
            },
          })
        }
      } catch {
        // fall through to normal HTML response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api/).*)',
  ],
}
