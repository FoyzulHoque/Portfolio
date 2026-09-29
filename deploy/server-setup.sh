#!/usr/bin/env bash
# ONE-TIME setup on the homelab server. Run as your normal user (not root):
#   bash server-setup.sh
# Safe to run again. Does not touch Caddy, UFW or your router.
set -euo pipefail

REPO_URL="https://github.com/FoyzulHoque/Portfolio.git"   # public repo: no credentials needed
APP_DIR="/srv/apps/portfolio"

[ "$(id -u)" -ne 0 ] || { echo "Run as your normal user (aman), not root."; exit 1; }
command -v docker >/dev/null || { echo "Docker is not installed."; exit 1; }

echo "==> packages (git, jq, curl)"
sudo apt-get update -qq
sudo apt-get install -y -qq git jq curl

echo "==> docker access for $USER"
if ! id -nG "$USER" | grep -qw docker; then
  sudo usermod -aG docker "$USER"
  echo "    added $USER to the docker group (takes effect on next login; the deploy service does not need it)"
fi

echo "==> web network"
sudo docker network inspect web >/dev/null 2>&1 || sudo docker network create web

echo "==> code in $APP_DIR"
sudo mkdir -p /srv/apps
if [ ! -d "$APP_DIR/.git" ]; then
  sudo git clone "$REPO_URL" "$APP_DIR"
fi
sudo chown -R "$USER":"$USER" "$APP_DIR"
git -C "$APP_DIR" fetch --quiet origin main
git -C "$APP_DIR" checkout --quiet main
git -C "$APP_DIR" reset --hard --quiet origin/main
chmod +x "$APP_DIR/deploy/deploy.sh"

echo "==> first build and start"
( cd "$APP_DIR" && sudo docker compose up -d --build )

echo "==> auto-deploy timer"
sed "s/__USER__/$USER/" "$APP_DIR/deploy/portfolio-deploy.service" | sudo tee /etc/systemd/system/portfolio-deploy.service >/dev/null
sudo cp "$APP_DIR/deploy/portfolio-deploy.timer" /etc/systemd/system/portfolio-deploy.timer
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-deploy.timer

cat <<'EOF'

==> DONE. Last manual step: point Caddy at the new container.
Edit /srv/apps/caddy/Caddyfile so the site block reads:

    foyzulhoque.com.bd, www.foyzulhoque.com.bd {
        reverse_proxy portfolio:80
    }

Then reload Caddy:

    sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile

Watch deployments with:   journalctl -u portfolio-deploy -f
Check the container with: docker ps --filter name=portfolio
EOF
