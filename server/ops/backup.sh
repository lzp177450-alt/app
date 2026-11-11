#!/usr/bin/env bash
# 每天备份 SQLite，保留 14 天。
set -uo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
OPS="$APP_DIR/app/server/ops"
BACKUP_DIR="$APP_DIR/shared/db/backups"

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

mkdir -p "$BACKUP_DIR"

if ! out=$(curl -fsS -m 120 -X POST -H "x-ops-token: ${OPS_TOKEN:-}" http://127.0.0.1/api/admin/backup 2>&1); then
  bash "$OPS/notify.sh" "**拾礼 · 备份失败**
$out" || true
  exit 1
fi

find "$BACKUP_DIR" -name 'app-*.db' -type f -mtime +14 -delete 2>/dev/null || true
echo "$out"
