# Foyzul Hoque · Portfolio

Static site (plain HTML/CSS/JS, no build step) with an **Academic** and an **Industry** mode.
Live data: GitHub streak + heatmap are fetched from public GitHub endpoints. No API keys are used.

## Run locally
```bash
python -m http.server 5173     # then open http://localhost:5173
```

## Edit content (you only need one file)
Everything on the page is in `js/content.js`: text, links, dates, projects, certificates.
- `shared`   → used in both modes (name, email, phone, education, certificates, letters)
- `academic` → researcher view (publications, research projects, interests)
- `industry` → engineer view (apps, experience detail)

## Change the look
Colours, radius and fonts are tokens at the top of `css/style.css` (sections 1–3).

## Add a certificate or letter
1. Watermark it first (never commit the original scan).
2. Put `name.jpg` and `name-thumb.jpg` in `assets/certs/` or `assets/letters/`.
3. Add a row to `certificates` / `letters` in `js/content.js`.

## Privacy rules
- Public repo: **never commit** `.env` files, tokens, original PDFs/scans, or ID numbers.
- CVs in `assets/cv/` have the street address removed (city only).
- Documents in `assets/letters` are watermarked and the student ID is blacked out.

## Deploy (homelab, automatic)

Merge to `main` → GitHub Actions `ci` runs (`.github/workflows/ci.yml`) → the server sees a green commit
within about a minute and rebuilds the container. If the new version is unhealthy it rolls back by itself.

Nothing is exposed for this: the server pulls from GitHub, no SSH key or open port is involved.

**One-time server setup** (run on the server after logging in yourself):
```bash
curl -fsSL https://raw.githubusercontent.com/FoyzulHoque/Portfolio/main/deploy/server-setup.sh -o server-setup.sh
bash server-setup.sh
```
Then follow the last message it prints (point Caddy at `portfolio:80`).

| Need | Command (on the server) |
|---|---|
| Watch deploys | `journalctl -u portfolio-deploy -f` |
| Container status | `docker ps --filter name=portfolio` |
| Deploy right now | `sudo systemctl start portfolio-deploy` |
| Pause auto-deploy | `sudo systemctl stop portfolio-deploy.timer` |

Recommended GitHub settings: protect `main` (require the `ci` check + a pull request).
