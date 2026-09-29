# CLAUDE.md — Foyzul Hoque portfolio

Static portfolio site (plain HTML/CSS/JS, no build step) with an **Academic** and an **Industry** mode.
Hosted on the owner's homelab behind Caddy, auto-deployed from `main`. See `docs/SERVER.md` for the server side.

> This repo is **public**. Anything committed is world-readable. Read "Hard rules" before changing anything.

## Hard rules
1. **No secrets in the repo**: no `.env`, tokens, passwords, private keys. `scripts/check.js` fails CI if it sees them.
2. **No personal identifiers in the repo**: student ID number, home street address, LAN/public IPs, MAC addresses.
   Public contact info is intentional and lives only in `js/content.js` (email, phone, city).
3. **Never commit original scans/PDFs.** Certificates and letters are published only as watermarked JPGs in
   `assets/certs/` and `assets/letters/` (letters have the student ID blacked out). CVs in `assets/cv/` have the street address removed.
4. **Never store or repeat the server password.** Do not SSH with a password yourself. See "Working on the server".
5. Merge to `main` = **deploys to production within ~1 minute** (if CI is green). Work on a branch, open a PR.

## Layout
```
index.html            shell (nav, mode switch, lightbox); content is rendered by JS
js/content.js         ALL text/links/dates/projects/certificates  <- edit this for content changes
js/app.js             renders sections per mode, GitHub streak fetch, lightbox, interactions
css/style.css         tokens (top of file) + materials (glass/neu/clay) + per-mode overrides
assets/               profile.png, favicon.svg, certs/, letters/, cv/
Dockerfile, compose.yml, .dockerignore     container that serves the site (nginx)
deploy/               nginx.conf, security-headers.conf, deploy.sh (generic engine), systemd units, server-setup.sh, add-app.sh
scripts/check.js      content + secret checks (runs in CI)
.github/workflows/ci.yml
docs/SERVER.md        how the server hosts and deploys this
docs/PLAYBOOK.md      day-to-day: update, maintain, host more apps (add-app.sh)
images/ ss/ videos/   OLD files from the previous site, not used, excluded from the image
```

## Common tasks
| Task | Do this |
|---|---|
| Change text, links, dates, projects | edit `js/content.js` |
| Change colours / radius / fonts | tokens at the top of `css/style.css` |
| Add a certificate or letter | watermark it first, add `name.jpg` + `name-thumb.jpg` to `assets/certs` or `assets/letters`, add a row in `content.js` |
| Update a CV | replace the PDF in `assets/cv/` (remove the street address first) |
| Show private repo count | set `githubPrivateRepos` in `content.js` (GitHub does not expose it publicly) |
| Hide phone number | delete the `phone` line in `content.js` |

## Run and check locally
```bash
python -m http.server 5173      # http://localhost:5173  (add ?mode=industry for the other mode)
node scripts/check.js           # same checks CI runs
```
Design notes: Academic = minimal + soft glass; Industry = brutalist/maximalist. Both share the same DOM/content.
Keep new UI consistent with both modes (test light + dark, phone width, and `?mode=` both ways).

## Deploy flow (short)
PR → CI (`ci` job) green → merge to `main` → server timer notices → `docker compose up -d --build` → health check →
rollback automatically if unhealthy. Details, commands and troubleshooting: `docs/SERVER.md`.

## Working on the server (protocol for Claude)
- Claude does **not** authenticate to the server. The owner logs in themselves in the app's **Terminal panel**
  (`ssh <user>@<server>`), then Claude uses `read_terminal` to see the session.
- Claude cannot type into that terminal: give the owner **one command at a time** in a fenced `bash` block, wait, read the output, continue.
- Prefer read-only commands first (`docker ps`, `journalctl`, `git -C /srv/apps/portfolio log -1`).
- Ask before anything destructive or outward-facing: editing `/srv/apps/caddy/Caddyfile`, reloading Caddy,
  `docker rm/prune`, changing UFW, stopping the timer, `git reset` on the server.
- Never touch the Caddy `.env` (Cloudflare token). Never print it.
- Server host/user/paths are in `CLAUDE.local.md` (git-ignored). It never contains passwords.

## Git conventions
- Branch per change, small PRs, message says what and why.
- Don't push to `main` directly; `main` should require the `ci` check.
- Do not bypass hooks or CI.
