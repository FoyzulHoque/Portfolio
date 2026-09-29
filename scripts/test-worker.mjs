// Tests deploy/cloudflare-failover-worker.js with fake origin/fallback:  node scripts/test-worker.mjs
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(dir, '../deploy/cloudflare-failover-worker.js'), 'utf8');
const tmp = path.join(dir, '.worker-under-test.mjs'); fs.writeFileSync(tmp, src);
const worker = (await import(pathToFileURL(tmp).href)).default; fs.unlinkSync(tmp);

let mode = 'up'; const store = new Map(); const calls = [];
globalThis.caches = { default: { match: async (k) => store.get(k), put: async (k, v) => { store.set(k, v); }, delete: async (k) => store.delete(k) } };
globalThis.fetch = async (input) => {
  const u = typeof input === 'string' ? input : input.url; calls.push(u);
  if (u.startsWith('https://foyzulhoque.github.io/Portfolio')) return new Response('PAGES COPY', { status: 200 });
  if (mode === 'down') throw new Error('unreachable');
  if (mode === '522') return new Response('cf error', { status: 522 });
  return new Response('HOMELAB', { status: 200 });
};
const ctx = { waitUntil: (p) => p };
const req = (p, m = 'GET') => new Request('https://foyzulhoque.com.bd' + p, { method: m });
const body = async (r) => [r.status, await r.text(), r.headers.get('X-Served-By')];
let bad = 0; const check = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : ` got ${JSON.stringify(got)} want ${JSON.stringify(want)}`)); };

mode = 'up';   check('homelab up -> homelab', await body(await worker.fetch(req('/'), {}, ctx)), [200, 'HOMELAB', null]);
mode = 'down'; check('homelab unreachable -> pages copy', await body(await worker.fetch(req('/'), {}, ctx)), [200, 'PAGES COPY', 'github-pages-fallback']);
calls.length = 0;
check('marked down -> skips homelab (fast)', await body(await worker.fetch(req('/css/style.css'), {}, ctx)), [200, 'PAGES COPY', 'github-pages-fallback']);
check('   ...and did not call the origin', calls.filter((u) => u.startsWith('https://foyzulhoque.com.bd')).length, 0);
check('/health while down -> 503, never pages', (await worker.fetch(req('/health'), {}, ctx)).status, 503);
mode = 'up';   check('/health when back -> 200 and clears mark', (await worker.fetch(req('/health'), {}, ctx)).status, 200);
check('homelab back -> homelab again', await body(await worker.fetch(req('/'), {}, ctx)), [200, 'HOMELAB', null]);
mode = '522';  store.clear(); check('origin 522 -> pages copy', await body(await worker.fetch(req('/'), {}, ctx)), [200, 'PAGES COPY', 'github-pages-fallback']);
mode = 'up';   store.clear(); calls.length = 0;
await worker.fetch(req('/x', 'POST'), {}, ctx); check('POST passes through untouched', calls.length, 1);
process.exit(bad ? 1 : 0);
