// Safety + sanity checks. Runs in CI and locally:  node scripts/check.js
// Fails (exit 1) if content is broken, a referenced file is missing, or something sensitive is in the repo.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const errors = [];
const fail = (m) => errors.push(m);

/* 1. content.js loads and every referenced file exists */
const ctx = { window: {} };
try { vm.runInNewContext(fs.readFileSync(path.join(root, 'js/content.js'), 'utf8'), ctx); }
catch (e) { fail('js/content.js does not run: ' + e.message); }
const C = ctx.window.CONTENT;
if (C) {
  const need = (p) => { if (!fs.existsSync(path.join(root, p))) fail('missing file: ' + p); };
  for (const [list, dir] of [['certificates', 'certs'], ['letters', 'letters']]) {
    for (const item of C.shared[list] || []) { need(`assets/${dir}/${item.img}.jpg`); need(`assets/${dir}/${item.img}-thumb.jpg`); }
  }
  for (const mode of ['academic', 'industry']) if (C[mode].cv) need(C[mode].cv.href);
  need('assets/profile.png');
}
for (const f of ['js/app.js', 'js/content.js']) {
  try { new vm.Script(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); } catch (e) { fail(f + ' has a syntax error: ' + e.message); }
}

/* 2. nothing sensitive is committed */
const SKIP = new Set(['.git', 'node_modules', 'images', 'ss', 'videos', 'scripts']);
const BAD = [
  [/1930725/, 'student ID number'],
  [/Malibag|Chowdhury para/i, 'home street address'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/, 'GitHub token'],
  [/192\.168\.\d+\.\d+|45\.127\.48\.48/, 'server IP address'],
  [/(?:[0-9a-f]{2}:){5}[0-9a-f]{2}/i, 'MAC address'],
  [/CLOUDFLARE_API_TOKEN\s*=\s*\S+/, 'Cloudflare token'],
];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name) || name === 'CLAUDE.local.md') continue;   // private, git-ignored notes
    const full = path.join(dir, name), rel = path.relative(root, full);
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (/^\.env/.test(name) && name !== '.env.example') fail('env file in repo: ' + rel);
    if (/\.(pdf|jpg|jpeg|png|mp4|mkv|ico|woff2?)$/i.test(name)) continue;
    const text = fs.readFileSync(full, 'utf8');
    for (const [re, label] of BAD) if (re.test(text)) fail(`${label} found in ${rel}`);
  }
};
walk(root);

/* 3. original scans must never be published: only watermarked -thumb/full pairs live in assets */
for (const dir of ['certs', 'letters']) {
  const d = path.join(root, 'assets', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) if (!/\.jpg$/.test(f)) fail(`unexpected file in assets/${dir}: ${f} (only watermarked .jpg allowed)`);
}

if (errors.length) { console.error('CHECK FAILED\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('All checks passed.');
