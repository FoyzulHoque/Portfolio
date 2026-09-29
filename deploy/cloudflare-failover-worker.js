// Cloudflare Worker: automatic failover for foyzulhoque.com.bd
//   1. Try the homelab (the normal origin behind Cloudflare).
//   2. If it is unreachable, too slow (>4s) or answers 5xx, serve the same page from GitHub Pages.
//   3. When the homelab is back, requests go to it again by themselves (checked at most ~20s later).
// Paste this into a Worker and attach the routes described in docs/FAILOVER.md. No secrets are used.

const FALLBACK = 'https://foyzulhoque.github.io/Portfolio';
const ORIGIN_TIMEOUT_MS = 4000;
const DOWN_MEMORY_SECONDS = 20;               // after a failure, skip the homelab this long so visitors don't wait 4s each
const DOWN_KEY = 'https://failover.internal/homelab-down';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'HEAD') return fetch(request);   // only pages/files are failed over

    const isHealth = url.pathname === '/health';
    const cache = caches.default;

    // Recently failed? Go straight to the fallback (but /health always re-tests the homelab).
    if (!isHealth && (await cache.match(DOWN_KEY))) return fromFallback(url, request);

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ORIGIN_TIMEOUT_MS);
      const res = await fetch(request, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.status >= 500) throw new Error('origin status ' + res.status);
      ctx.waitUntil(cache.delete(DOWN_KEY));                                             // homelab is healthy
      return res;
    } catch (err) {
      ctx.waitUntil(cache.put(DOWN_KEY, new Response('down', { headers: { 'Cache-Control': `max-age=${DOWN_MEMORY_SECONDS}` } })));
      if (isHealth) return new Response('homelab down', { status: 503, headers: { 'Cache-Control': 'no-store' } });
      return fromFallback(url, request);
    }
  },
};

async function fromFallback(url, request) {
  const target = FALLBACK + url.pathname + url.search;          // "/" -> ".../Portfolio/"
  const res = await fetch(target, { method: request.method, headers: { Accept: request.headers.get('Accept') || '*/*' } });
  const out = new Response(res.body, res);
  out.headers.set('X-Served-By', 'github-pages-fallback');
  out.headers.set('Cache-Control', 'public, max-age=60');
  return out;
}
