#!/usr/bin/env bash
# 回滚到指定提交（默认上一版）。
set -euo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
REPO="$APP_DIR/app"
OPS="$REPO/server/ops"
COMPOSE="docker compose -p shili -f $REPO/server/docker-compose.yml"
TARGET=${1:-HEAD~1}

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
notify() { bash "$OPS/notify.sh" "$@" || true; }

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

cd "$REPO"
FROM=$(git rev-parse --short HEAD)
git reset --hard "$TARGET" >/dev/null
TO=$(git rev-parse --short HEAD)
log "回滚 $FROM -> $TO"
APP_VERSION="$TO" $COMPOSE up -d --build

for _ in $(seq 1 45); do
  if curl -fsS -m 3 http://127.0.0.1/api/health >/dev/null 2>&1; then
    notify "**拾礼 · 已回滚**
\`$FROM\` → \`$TO\`"
    exit 0
  fi
  sleep 2
done

notify "**拾礼 · 回滚后仍不健康**
目标版本：\`$TO\`，需要人工处理。"
exit 1
