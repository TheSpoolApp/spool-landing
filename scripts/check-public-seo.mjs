import assert from 'node:assert/strict';

// Run against a started Next.js server: node scripts/check-public-seo.mjs [base-url]
const baseUrl = process.argv[2] || 'http://localhost:3000';

async function get(path, userAgent, accept = 'text/html') {
  return fetch(new URL(path, baseUrl), {
    redirect: 'manual',
    headers: { Accept: accept, ...(userAgent ? { 'User-Agent': userAgent } : {}) },
    signal: AbortSignal.timeout(30_000),
  });
}

// Check streaming browser responses and blocking search-crawler responses.
for (const userAgent of ['Mozilla/5.0', 'Googlebot']) {
  for (const path of [
    '/blog/seo-smoke-missing-article',
    '/compare/seo-smoke-missing-article',
    '/blog/toString',
    '/compare/constructor',
  ]) {
    const response = await get(path, userAgent);
    assert.equal(response.status, 404, `${path} must return a real 404 for ${userAgent}`);
    assert.match(await response.text(), /name="robots" content="[^"]*\bnoindex\b/);
  }

  for (const [path, destination] of [
    ['/blog/spool-vs-opal', '/compare/spool-vs-opal'],
    ['/compare/how-to-stop-doom-scrolling', '/blog/how-to-stop-doom-scrolling'],
    ['/blog/how-to-stop-doomscrolling-on-instagram-reels-without-quitting', '/blog/how-to-stop-doomscrolling-on-instagram-reels'],
  ]) {
    const response = await get(path, userAgent);
    assert.equal(response.status, 308, `${path} must redirect permanently for ${userAgent}`);
    assert.equal(new URL(response.headers.get('location'), baseUrl).pathname, destination);

    const canonicalResponse = await get(destination, userAgent);
    assert.equal(canonicalResponse.status, 200, `${destination} must remain available`);
    const html = await canonicalResponse.text();
    assert.ok(
      html.includes(`rel="canonical" href="https://www.thespoolapp.com${destination}"`),
      `${destination} must use its own canonical URL`,
    );
  }
}

for (const [path, expectedStatus] of [
  ['/blog/seo-smoke-missing-article', 404],
  ['/blog/spool-vs-opal', 308],
  ['/blog/how-to-stop-doomscrolling-on-instagram-reels-without-quitting', 308],
  ['/blog/how-to-stop-doom-scrolling', 200],
]) {
  const response = await get(path, 'Googlebot', 'text/markdown');
  assert.equal(response.status, expectedStatus, `${path} must preserve routing for Markdown clients`);
  assert.equal(response.headers.get('x-spool-markdown-source'), null);
  if (expectedStatus === 200) {
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /<h1[^>]*>How to Stop Doom Scrolling:/);
  }
}

const response = await get('/');
assert.equal(response.status, 200);
const html = await response.text();
const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));
const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
assert.ok(faq, 'Homepage must include its FAQ structured data');
const details = [...html.matchAll(/<details\b[^>]*class="faq-item"[^>]*>([\s\S]*?)<\/details>/g)];
assert.equal(details.length, faq.mainEntity.length, 'Every FAQ must have a native disclosure');

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'" };
const decode = (value) => value.replace(/&(amp|lt|gt|quot|#x27|#39);/g, (_, entity) => entities[entity]);
for (const [index, question] of faq.mainEntity.entries()) {
  const content = details[index][1];
  assert.match(content, /<summary\b/, 'FAQ must have a keyboard-operable summary');
  const answer = content.match(/<div class="faq-answer"><p>([\s\S]*?)<\/p><\/div>/);
  assert.ok(answer, `${question.name} must have an answer in the initial HTML`);
  assert.equal(decode(answer[1]), question.acceptedAnswer.text);
}

console.log('Public SEO checks passed: real 404s, canonical redirects, and crawlable FAQ answers.');
