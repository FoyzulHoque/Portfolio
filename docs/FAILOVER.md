# Failover: GitHub Pages as the backup for foyzulhoque.com.bd

Goal: if the homelab (or the home internet) goes down, visitors still see the site. When the homelab is back,
everyone returns to it automatically, even people who arrived through the `github.io` address.

```
visitor → foyzulhoque.com.bd → Cloudflare Worker ──ok──> homelab (Caddy → nginx)
                                        │
                                        └─ down / slow / 5xx ─> foyzulhoque.github.io/Portfolio  (same repo, GitHub Pages)

visitor → foyzulhoque.github.io/Portfolio → js/failover.js asks https://foyzulhoque.com.bd/health
              answers "ok" → redirect to foyzulhoque.com.bd      no answer → stay on the GitHub copy
```

## The two pieces
| Piece | Where | Needs setup? |
|---|---|---|
| `js/failover.js` (github.io → main domain when the homelab is up) + `/health` endpoint | in the repo, deployed automatically | no |
| `deploy/cloudflare-failover-worker.js` (main domain → GitHub copy when the homelab is down) | Cloudflare, one-time | **yes, below** |

Why Cloudflare: when the home server is off nothing at home can answer, so something outside the house has to.
DNS for `foyzulhoque.com.bd` is already on Cloudflare, and Workers are free (100,000 requests/day).

## One-time Cloudflare setup (dashboard, about 5 minutes)
1. **DNS → Records:** for `foyzulhoque.com.bd` and `www`, switch the cloud to **Proxied** (orange). Leave `api`, `admin`, `files` as they are.
2. **SSL/TLS → Overview:** set the mode to **Full (strict)**. Caddy already has valid certificates, and any other mode can cause redirect loops.
3. **Workers & Pages → Create → Worker.** Name it `portfolio-failover`, click **Deploy**, then **Edit code**, replace the content with
   `deploy/cloudflare-failover-worker.js` from this repo, and **Deploy** again.
4. Worker → **Settings → Domains & Routes → Add → Route**, zone `foyzulhoque.com.bd`. Add both:
   `foyzulhoque.com.bd/*` and `www.foyzulhoque.com.bd/*`.

## Test it (do this once)
| Test | Expect |
|---|---|
| Normal: `curl -sI https://foyzulhoque.com.bd/` | HTTP 200, **no** `X-Served-By` header |
| Outage: on the server `docker stop portfolio`, reload the site | the site still loads within ~5 s; `curl -sI` shows `X-Served-By: github-pages-fallback` |
| Recovery: `docker start portfolio`, wait ~30 s | header disappears, homelab serves again |
| With the homelab up, open `foyzulhoque.github.io/Portfolio/` | jumps to `foyzulhoque.com.bd` (add `?stay=1` to stay on the GitHub copy) |
| With the homelab stopped, open `foyzulhoque.github.io/Portfolio/` | stays on the GitHub copy |

## How it behaves
- The first visitor after a failure waits up to 4 s; the Worker then remembers "down" for 20 s so others are instant.
- Only GET/HEAD (pages and files) are failed over. Future APIs are not affected.
- `/health` is never answered from the fallback, so the redirect script cannot mistake the backup for the real site.
- The GitHub copy is the same `main` branch and updates on every merge (Pages has no CI gate).
- A total home outage (power or ISP) is covered, because Cloudflare sits outside your house.

## Limits and rollback
- If Cloudflare itself is down, nothing can help; that is very rare.
- The `/health` CORS header only allows `https://foyzulhoque.github.io`.
- **Undo:** delete the two Worker routes and set the DNS records back to **DNS only** (grey cloud). The site keeps working as before.
- Proxying hides the home IP from visitors, which is a security bonus.
- Caddy needs no change: its certificates still renew through the Cloudflare DNS challenge.
