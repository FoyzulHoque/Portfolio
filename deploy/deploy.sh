#!/usr/bin/env bash
# Runs ON THE SERVER every minute (systemd timer). Deploys origin/<branch> when GitHub CI is green.
# Pull model: the server only makes outbound requests, no inbound port or SSH key is needed.
#
# Generic engine: one copy serves every app. Settings come from the environment:
#   NAME (default portfolio)  REPO (owner/repo)  APP_DIR  BRANCH (main)  REQUIRE_CI (1)
# The portfolio timer uses the defaults; other apps get their values from /etc/homelab-deploy/<name>.env
# (see add-app.sh and app-deploy@.service).
set -euo pipefail

NAME="${NAME:-portfolio}"
APP_DIR="${APP_DIR:-/srv/apps/$NAME}"
REPO="${REPO:-FoyzulHoque/Portfolio}"
BRANCH="${BRANCH:-main}"
REQUIRE_CI="${REQUIRE_CI:-1}"          # set to 0 for repos without a CI workflow

log() { echo "[deploy:$NAME] $*"; }

ci_state() {   # prints: ok | pending | failed
  local runs
  runs=$(curl -fsS -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/commits/$1/check-runs") || { echo pending; return; }
  if [ "$(jq '.total_count' <<<"$runs")" -eq 0 ]; then echo pending; return; fi
  if jq -e '[.check_runs[] | select(.status != "completed")] | length > 0' <<<"$runs" >/dev/null; then echo pending; return; fi
  if jq -e '[.check_runs[] | select(.conclusion != "success" and .conclusion != "skipped" and .conclusion != "neutral")] | length > 0' <<<"$runs" >/dev/null; then echo failed; return; fi
  echo ok
}

# Every container of the compose project must be running, and healthy if it defines a healthcheck.
wait_healthy() {
  local ids id st hs ok
  for _ in $(seq 1 30); do
    ok=1
    ids=$(docker compose ps -q)
    [ -n "$ids" ] || ok=0
    for id in $ids; do
      st=$(docker inspect -f '{{.State.Status}}' "$id")
      hs=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$id")
      [ "$st" = running ] || ok=0
      [ -z "$hs" ] || [ "$hs" = healthy ] || ok=0
    done
    [ "$ok" = 1 ] && return 0
    sleep 2
  done
  return 1
}

main() {
  exec 9>"/tmp/deploy-$NAME.lock"
  flock -n 9 || exit 0                       # another deploy of this app is running
  cd "$APP_DIR"

  git fetch --quiet origin "$BRANCH"
  local current latest
  current=$(git rev-parse HEAD)
  latest=$(git rev-parse "origin/$BRANCH")
  [ "$current" = "$latest" ] && exit 0

  if [ "$REQUIRE_CI" = 1 ]; then
    case "$(ci_state "$latest")" in
      pending) log "waiting for CI on ${latest:0:7}"; exit 0 ;;
      failed)
        if [ ! -e "/tmp/deploy-$NAME.skip-$latest" ]; then log "CI failed on ${latest:0:7}, not deploying"; touch "/tmp/deploy-$NAME.skip-$latest"; fi
        exit 0 ;;
    esac
  fi

  log "deploying ${latest:0:7} (was ${current:0:7})"
  git reset --hard --quiet "origin/$BRANCH"
  if docker compose up -d --build && wait_healthy; then
    log "deployed ${latest:0:7}"
    docker image prune -f >/dev/null
  else
    log "new version unhealthy, rolling back to ${current:0:7}"
    git reset --hard --quiet "$current"
    docker compose up -d --build
    exit 1
  fi
}

main "$@"
exit   # the file may be replaced by `git reset` while running; never read past this point
