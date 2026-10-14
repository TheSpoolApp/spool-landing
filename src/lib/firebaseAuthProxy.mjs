const HELPERS = new Set(['handler', 'handler.js', 'iframe', 'iframe.js', 'experiments.js', 'links', 'links.js']);

// Fixed Firebase project and fixed public helper paths: never proxy an arbitrary URL,
// browser cookies or Authorization headers. OAuth form bodies are forwarded intact.
export async function proxyFirebaseAuth(request, { params }, fetchImpl = fetch) {
  const { path } = await params;
  if (path?.length !== 1 || !HELPERS.has(path[0])) return new Response('Not found', { status: 404 });
  if (!['GET', 'POST'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
  const upstream = new URL(`https://spool-a5020.firebaseapp.com/__/auth/${path[0]}`);
  upstream.search = new URL(request.url).search;
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  try {
    const response = await fetchImpl(upstream, {
      method: request.method, headers, cache: 'no-store', redirect: 'manual',
      body: request.method === 'POST' ? await request.arrayBuffer() : undefined,
      signal: AbortSignal.timeout(15000),
    });
    // Helpers must be served on this origin, never forwarded as a redirect.
    if (response.status >= 300 && response.status < 400) return unavailable();
    return new Response(response.body, { status: response.status, headers: {
      'Content-Type': response.headers.get('content-type') || 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    } });
  } catch {
    return unavailable();
  }
}

function unavailable() {
  return new Response('Sign-in is temporarily unavailable. Return to the dashboard and try again.', {
    status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
