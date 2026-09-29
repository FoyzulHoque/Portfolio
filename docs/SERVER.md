# Server: how the portfolio is hosted and deployed

This is the server-side guide for this repo. It covers only the portfolio. The full homelab (router, Cloudflare,
UFW, Caddy, certificates) is documented separately in the owner's private homelab notes; this file avoids IP addresses
and secrets because the repo is public.

## 1. Big picture
```
Browser ──HTTPS──> foyzulhoque.com.bd ──> router (80/443) ──> homelab ──> UFW ──> Caddy ──> portfolio (nginx)
                                                                                     │
                                                                          Docker network "web"
```
- **Caddy** is the only public entry point. It terminates HTTPS (Let's Encrypt via Cloudflare DNS-01) and proxies to `portfolio:80`.
- **portfolio** is an nginx container serving the static files. It publishes **no ports** and is reachable only through the `web` Docker network.
- **Auto-deploy** is a systemd timer on the server. It pulls from GitHub; nothing is pushed into the server.

## 2. What lives where
| Thing | Location |
|---|---|
| App checkout (git clone of this repo) | `/srv/apps/portfolio/` |
| Container / compose project | `portfolio` (`/srv/apps/portfolio/compose.yml`) |
| Deploy script | `/srv/apps/portfolio/deploy/deploy.sh` |
| systemd units | `/etc/systemd/system/portfolio-deploy.service` and `.timer` |
| Caddy config (not in this repo) | `/srv/apps/caddy/Caddyfile` |
| Docker network shared with Caddy | `web` (external) |

## 3. The deploy pipeline
1. A change is merged to `main`.
2. GitHub Actions (`ci`) runs `scripts/check.js`, parses the shell scripts, builds the image, starts it and requests a few URLs.
3. Every minute `portfolio-deploy.timer` runs `deploy.sh`, which:
   - `git fetch`es `main`; exits if nothing changed.
   - Asks the public GitHub API for the check-runs of that commit. **Pending → waits. Failed → skips (logged once). Green → continues.**
   - `git reset --hard origin/main`, then `docker compose up -d --build`.
   - Waits for the container's Docker healthcheck to become `healthy`.
   - **Unhealthy → rolls back** to the previous commit and rebuilds it.
4. Old images are pruned.

Why a pull model: the server sits behind a home router with a changing public IP. Pulling needs no inbound access,
no SSH key in GitHub and no self-hosted runner (which is risky on a public repo).

## 4. First-time setup (once)
The owner logs in to the server, then:
```bash
curl -fsSL https://raw.githubusercontent.com/FoyzulHoque/Portfolio/main/deploy/server-setup.sh -o server-setup.sh
bash server-setup.sh
```
The script is idempotent. It installs `git jq curl`, creates the `web` network if missing, clones the repo to `/srv/apps/portfolio`,
builds and starts the container, and enables the timer. It does **not** edit Caddy, UFW or the router.

Then point Caddy at the container (manual, one time) in `/srv/apps/caddy/Caddyfile`:
```caddyfile
foyzulhoque.com.bd, www.foyzulhoque.com.bd {
    reverse_proxy portfolio:80
}
```
Reload without downtime:
```bash
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```
(The old `website` container can be stopped once the new site works: `docker compose -f /srv/apps/website/compose.yml down`.)

## 5. Everyday commands (on the server)
| Need | Command |
|---|---|
| What is running? | `docker ps --filter name=portfolio` |
| Deploy log, live | `journalctl -u portfolio-deploy -f` |
| Deploy right now | `sudo systemctl start portfolio-deploy` |
| Deployed commit | `git -C /srv/apps/portfolio log -1 --oneline` |
| Pause auto-deploy | `sudo systemctl stop portfolio-deploy.timer` |
| Resume | `sudo systemctl start portfolio-deploy.timer` |
| Deploy without waiting for CI | `sudo systemd-run --uid=$USER -p SupplementaryGroups=docker -E REQUIRE_CI=0 /usr/bin/bash /srv/apps/portfolio/deploy/deploy.sh` |
| Container logs | `docker logs portfolio` |
| Caddy logs | `docker logs caddy` |

## 6. Roll back by hand
```bash
sudo systemctl stop portfolio-deploy.timer
git -C /srv/apps/portfolio log --oneline -5          # pick a good commit
git -C /srv/apps/portfolio reset --hard <commit>
cd /srv/apps/portfolio && docker compose up -d --build
```
The timer would redeploy `main` on the next tick, so also revert the bad change on GitHub before starting it again.

## 7. Troubleshooting (check left to right, don't guess)
`DNS → public IP → router forwarding → UFW → Caddy → Docker network → container → app`

| Symptom | Look at |
|---|---|
| Site down, other sites fine | `docker ps` (is `portfolio` up and `healthy`?), `docker logs portfolio` |
| Caddy says 502 | `docker network inspect web` (are `caddy` and `portfolio` both attached?) |
| Merged but nothing changed | `journalctl -u portfolio-deploy -n 50`: "waiting for CI" (CI running/absent) or "CI failed" |
| Rolled back | the log line says so; open the failed `ci` run on GitHub or run `docker compose up --build` by hand to see the error |
| Whole domain down | public IP may have changed (`curl -4 ifconfig.me` vs the Cloudflare record). Dynamic DNS is not set up yet |

## 8. Security notes
- Nothing in this repo is secret. The only secret on the server (Cloudflare API token) lives in `/srv/apps/caddy/.env` and must never be copied here.
- The container publishes no ports, serves no dotfiles and sends basic security headers (`deploy/nginx.conf`).
- `deploy.sh` runs as the normal user (with the `docker` group) and only ever runs `git` and `docker compose` in `/srv/apps/portfolio`.
- Do not use passwords over SSH long term: switch to key-only login and ideally reach SSH through a VPN such as Tailscale.
- Recommended GitHub setting: protect `main` (pull request + `ci` check required), because a merge is a production deploy.

## 9. Adding another app the same way
Give it its own folder in `/srv/apps/<name>/`, its own `compose.yml` joining the `web` network without publishing ports,
add a site block to the Caddyfile (`reverse_proxy <container>:<port>`), reload Caddy, and add DNS if it needs a new subdomain.
Databases stay on a private Docker network and are never exposed.

## 10. Not done yet
Dynamic DNS · automated backups (one disk is not a backup) · monitoring/alerts · SSH hardening / VPN · Cloudflare proxy.
