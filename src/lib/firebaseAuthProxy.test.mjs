import test from 'node:test';
import assert from 'node:assert/strict';
import { proxyFirebaseAuth } from './firebaseAuthProxy.mjs';

test('auth helper keeps query, stays same-origin and never forwards dashboard credentials', async () => {
  const req = new Request('https://www.thespoolapp.com/__/auth/iframe?apiKey=public&v=1', {
    headers: { authorization: 'Bearer private', cookie: 'session=private' },
  });
  const result = await proxyFirebaseAuth(req, { params: Promise.resolve({ path: ['iframe'] }) }, async (url, options) => {
    assert.equal(String(url), 'https://spool-a5020.firebaseapp.com/__/auth/iframe?apiKey=public&v=1');
    assert.equal(options.headers.has('cookie'), false); assert.equal(options.headers.has('authorization'), false);
    assert.equal(options.redirect, 'manual'); assert.equal(options.cache, 'no-store');
    return new Response('<html>helper</html>', { headers: { 'content-type': 'text/html', 'cache-control': 'max-age=3600', 'set-cookie': 'foreign=value' } });
  });
  assert.equal(result.status, 200); assert.equal(await result.text(), '<html>helper</html>');
  assert.equal(result.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(result.headers.get('cache-control'), 'no-store'); assert.equal(result.headers.get('set-cookie'), null);
});
test('OAuth POST body is forwarded unchanged', async () => {
  const result = await proxyFirebaseAuth(new Request('https://www.thespoolapp.com/__/auth/handler', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'state=test&code=test',
  }), { params: { path: ['handler'] } }, async (_url, options) => {
    assert.equal(options.method, 'POST'); assert.equal(new TextDecoder().decode(options.body), 'state=test&code=test');
    assert.equal(options.headers.get('content-type'), 'application/x-www-form-urlencoded');
    return new Response('ok');
  });
  assert.equal(result.status, 200);
});
test('unknown/traversal paths cannot reach upstream', async () => {
  for (const path of [['..', 'admin'], ['https://evil.test'], ['unknown']]) {
    const r = await proxyFirebaseAuth(new Request('https://www.thespoolapp.com/__/auth/x'), { params: { path } }, () => assert.fail('upstream called'));
    assert.equal(r.status, 404);
  }
});
test('redirects and upstream failures fail closed without exposing provider details', async () => {
  for (const fetcher of [async () => new Response(null,{status:302,headers:{location:'https://evil.test'}}), async () => { throw new Error('private diagnostic'); }]) {
    const r = await proxyFirebaseAuth(new Request('https://www.thespoolapp.com/__/auth/iframe'), { params: { path: ['iframe'] } }, fetcher);
    assert.equal(r.status, 502); assert.equal(r.headers.get('location'), null);
    assert.equal((await r.text()).includes('private'), false);
  }
});
