# Playbook: update, maintain, and host more apps

Day-to-day guide. How the server is built is in `SERVER.md`; project rules are in `../CLAUDE.md`.

## 1. Updating the portfolio
```
edit → branch → push → pull request → ci green → merge → live in ~1 min (homelab + GitHub Pages)
```
1. `git checkout -b my-change` and edit (`js/content.js` for text, `css/style.css` for looks).
2. Test locally: `python -m http.server 5173`, then `node scripts/check.js`.
3. Push the branch, open a pull request, wait for `ci`, merge.
4. Watch the deploy on the server: `journalctl -u portfolio-deploy -f`.

**Caching:** text, design and script edits (`content.js`, `app.js`, `style.css`, `index.html`) show up immediately after the deploy.
If you replace an image, certificate or CV **under the same file name**, it can stay cached up to ~4 hours: in Cloudflare open
**Caching → Configuration → Purge Everything** to refresh it instantly (or give the new file a new name).

Undo a bad release: revert the pull request on GitHub; the server redeploys the previous version.
The server also rolls back by itself when the new container is unhealthy.
GitHub Pages has no CI gate, so protect `main` (require the `ci` check + a pull request).

## 2. Keeping the server healthy
| When | Task |
|---|---|
| Monthly | `sudo apt update && sudo apt upgrade`, then reboot at a quiet time (containers restart on their own) |
| Monthly | `df -h /` and `docker system df` (deploys already prune old images) |
| Automatic | HTTPS certificates renew through Caddy |
| After a power/ISP outage | If sites are down, check whether the **public IP changed** and update the Cloudflare records |

Still to do (in this order): **backups** (one SSD is not a backup) · **SSH hardening** (key-only, ideally via Tailscale) ·
unattended security updates + an uptime monitor · Dynamic DNS.

## 3. Hosting another site or API on the same server
Caddy stays the only public entry point; every app is a container behind it.

**One command registers the app for auto-deploy** (on the server, as your normal user):
```bash
bash /srv/apps/portfolio/deploy/add-app.sh <name> <github-owner/repo>
```
It clones the repo to `/srv/apps/<name>`, writes `/etc/homelab-deploy/<name>.env`, installs the shared systemd template
(`app-deploy@.service` and `.timer`), starts the app, and enables `app-deploy@<name>.timer`. Then finish by hand:

| Step | What |
|---|---|
| Secrets | create `/srv/apps/<name>/.env` on the server, `chmod 600`. Never in GitHub. |
| Compose | join the external `web` network; publish **no ports** |
| Database | separate private network, never on `web`, data under `/srv/docker/<name>/` |
| DNS | A record for the subdomain in Cloudflare (same public IP) |
| Caddy | add `sub.foyzulhoque.com.bd { reverse_proxy <container>:<port> }`, validate, reload |
| CI | add a workflow in that repo (build + tests). Without one, set `REQUIRE_CI=0` in `/etc/homelab-deploy/<name>.env` |

Minimal `compose.yml` for an API with a private database:
```yaml
services:
  api:
    build: .
    restart: unless-stopped
    env_file: .env
    networks: [web, internal]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8000/health"]
      interval: 10s
  db:
    image: postgres:16
    restart: unless-stopped
    env_file: .env
    volumes: ["/srv/docker/api/db:/var/lib/postgresql/data"]
    networks: [internal]          # not on "web": never reachable from Caddy or the internet
networks:
  web: { external: true }
  internal: {}
```
The deploy waits until every container is running (and healthy, if it has a healthcheck) and rolls back if not.
Run database migrations as a deliberate step, not blindly on every deploy.

**Limits:** apps must be in **public** repos (the server clones without credentials). For private repos, add a read-only
deploy key on the server first. Builds run on the laptop; for heavy backends, later build images in GitHub Actions
and let the server only pull them.

## 4. If the server goes down
The site fails over to the GitHub Pages copy automatically once the Cloudflare Worker is set up (see `FAILOVER.md`),
and returns to the homelab by itself when it is healthy again.

## 5. Useful commands (on the server)
| Need | Command |
|---|---|
| All containers | `docker ps` |
| One app's deploy log | `journalctl -u app-deploy@<name> -f` (portfolio: `portfolio-deploy`) |
| Deploy now | `sudo systemctl start app-deploy@<name>` |
| Pause an app's auto-deploy | `sudo systemctl stop app-deploy@<name>.timer` |
| List deploy timers | `systemctl list-timers '*deploy*'` |
| Caddy logs | `docker logs caddy` |
| Edit Caddy safely | back up `Caddyfile`, edit, `caddy validate`, then `caddy reload` |
