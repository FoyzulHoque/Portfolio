// Tests js/failover.js with a fake browser:  node scripts/test-failover.js
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '../js/failover.js'), 'utf8');

async function run({ host, pathname = '/Portfolio/', search = '', hash = '', health }) {
  let redirected = null, fetched = null;
  const location = { hostname: host, pathname, search, hash, replace: (u) => { redirected = u; } };
  const fetch = (url) => { fetched = url; return health(); };
  class AbortController { constructor() { this.signal = {}; } abort() {} }
  vm.runInNewContext(code, { location, fetch, AbortController, setTimeout, clearTimeout, window: { fetch, AbortController } });
  await new Promise((r) => setTimeout(r, 30));
  return { redirected, fetched };
}
const ok = () => Promise.resolve({ ok: true, text: () => Promise.resolve('ok\n') });
const notFound = () => Promise.resolve({ ok: false, text: () => Promise.resolve('') });
const html = () => Promise.resolve({ ok: true, text: () => Promise.resolve('<html>error</html>') });
const down = () => Promise.reject(new Error('network'));

(async () => {
  const cases = [
    ['github.io + homelab up -> redirect to primary', { host: 'foyzulhoque.github.io', health: ok }, 'https://foyzulhoque.com.bd/'],
    ['keeps path, query and hash', { host: 'foyzulhoque.github.io', pathname: '/Portfolio/assets/x', search: '?mode=industry', hash: '#contact', health: ok }, 'https://foyzulhoque.com.bd/assets/x?mode=industry#contact'],
    ['github.io + homelab down -> stay', { host: 'foyzulhoque.github.io', health: down }, null],
    ['github.io + /health 404 (fallback copy) -> stay', { host: 'foyzulhoque.github.io', health: notFound }, null],
    ['github.io + wrong body -> stay', { host: 'foyzulhoque.github.io', health: html }, null],
    ['github.io + ?stay=1 -> stay', { host: 'foyzulhoque.github.io', search: '?stay=1', health: ok }, null],
    ['primary domain never redirects', { host: 'foyzulhoque.com.bd', pathname: '/', health: ok }, null],
    ['localhost never redirects', { host: 'localhost', pathname: '/', health: ok }, null],
  ];
  let bad = 0;
  for (const [name, args, want] of cases) {
    const { redirected } = await run(args);
    const pass = redirected === want; if (!pass) bad++;
    console.log((pass ? 'PASS ' : 'FAIL ') + name + (pass ? '' : `  (got ${redirected}, want ${want})`));
  }
  process.exit(bad ? 1 : 0);
})();
