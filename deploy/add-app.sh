#!/usr/bin/env bash
# Register ANOTHER app (API, admin, website...) for auto-deploy on the homelab.
# Run on the server as your normal user:
#   bash /srv/apps/portfolio/deploy/add-app.sh <name> <github-owner/repo> [branch]
# Example:
#   bash /srv/apps/portfolio/deploy/add-app.sh api FoyzulHoque/my-api
# Public repos only (the clone uses https without credentials). Does not touch Caddy, DNS or UFW.
set -euo pipefail

NAME="${1:-}"; REPO="${2:-}"; BRANCH="${3:-main}"
usage() { echo "usage: add-app.sh <name> <github-owner/repo> [branch]"; exit 1; }
[ -n "$NAME" ] && [ -n "$REPO" ] || usage
[[ "$NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "name: lowercase letters, digits and dashes only"; exit 1; }
[[ "$REPO" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]] || { echo "repo must look like owner/repo"; exit 1; }
[ "$(id -u)" -ne 0 ] || { echo "Run as your normal user, not root."; exit 1; }
[ "$NAME" != portfolio ] || { echo "portfolio already has its own timer (portfolio-deploy)."; exit 1; }

ENGINE=/srv/apps/portfolio/deploy
APP_DIR="/srv/apps/$NAME"
[ -f "$ENGINE/deploy.sh" ] || { echo "$ENGINE/deploy.sh not found - run server-setup.sh first."; exit 1; }

echo "==> code in $APP_DIR"
sudo mkdir -p /srv/apps /etc/homelab-deploy
[ -d "$APP_DIR/.git" ] || sudo git clone --branch "$BRANCH" "https://github.com/$REPO.git" "$APP_DIR"
sudo chown -R "$USER":"$USER" "$APP_DIR"

echo "==> settings in /etc/homelab-deploy/$NAME.env"
sudo tee "/etc/homelab-deploy/$NAME.env" >/dev/null <<EOF
NAME=$NAME
REPO=$REPO
BRANCH=$BRANCH
APP_DIR=$APP_DIR
# 1 = wait for a green GitHub Actions check before deploying. Use 0 if the repo has no workflow.
REQUIRE_CI=1
EOF

echo "==> systemd template (shared by all apps)"
sed "s/__USER__/$USER/" "$ENGINE/app-deploy@.service" | sudo tee /etc/systemd/system/app-deploy@.service >/dev/null
sudo cp "$ENGINE/app-deploy@.timer" /etc/systemd/system/app-deploy@.timer
sudo systemctl daemon-reload

echo "==> first start (needs a compose.yml in the repo)"
if ls "$APP_DIR"/compose.y*ml "$APP_DIR"/docker-compose.y*ml >/dev/null 2>&1; then
  ( cd "$APP_DIR" && docker compose up -d --build ) || \
    echo "!! first start failed (missing .env with secrets?). Fix it, then: cd $APP_DIR && docker compose up -d --build"
else
  echo "!! no compose file found in $APP_DIR. Add one, then: cd $APP_DIR && docker compose up -d --build"
fi

sudo systemctl enable --now "app-deploy@$NAME.timer"

cat <<EOF

==> "$NAME" is registered. Remaining manual steps:
 1. Secrets: create $APP_DIR/.env on the server (chmod 600). Never commit it.
 2. Compose must join the "web" network for anything Caddy serves, and publish NO ports.
    Databases go on a separate private network, never on "web".
 3. DNS: add an A record for the subdomain in Cloudflare (same public IP as the others).
 4. Caddy: add a block to /srv/apps/caddy/Caddyfile, e.g.
        $NAME.foyzulhoque.com.bd {
            reverse_proxy <container-name>:<internal-port>
        }
    then validate and reload:
        docker exec caddy caddy validate --config /etc/caddy/Caddyfile && docker exec caddy caddy reload --config /etc/caddy/Caddyfile
Watch deploys: journalctl -u app-deploy@$NAME -f
EOF
