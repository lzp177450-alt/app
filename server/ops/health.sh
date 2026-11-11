#!/usr/bin/env bash
# 每 2 分钟体检：探活、磁盘、内存。失败先自愈一次，仍失败才推送。
set -uo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
REPO="$APP_DIR/app"
OPS="$REPO/server/ops"
LOG_DIR="$APP_DIR/logs"
STATE_FILE="$LOG_DIR/health.state"
COMPOSE="docker compose -p shili -f $REPO/server/docker-compose.yml"

mkdir -p "$LOG_DIR"

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

detail=""

alive() { curl -fsS -m 5 http://127.0.0.1/api/health >/dev/null 2>&1; }

if ! alive; then
  detail="API 无响应；"
fi

disk=$(df / | awk 'NR==2 {gsub("%","",$5); print $5}')
if [ "${disk:-0}" -ge 85 ]; then
  detail+="磁盘 ${disk}%；"
fi

mem=$(free | awk '/^Mem:/ {printf "%d", $3/$2*100}')
if [ "${mem:-0}" -ge 90 ]; then
  detail+="内存 ${mem}%；"
fi

if [ -z "$detail" ]; then
  echo ok > "$STATE_FILE"
  exit 0
fi

# 先尝试自愈
$COMPOSE restart api >/dev/null 2>&1
sleep 15

if alive; then
  if [ "$(cat "$STATE_FILE" 2>/dev/null)" != "recovered" ]; then
    bash "$OPS/notify.sh" "**拾礼 · 已自愈**
$detail
重启 api 后恢复。" || true
    echo recovered > "$STATE_FILE"
  fi
  exit 0
fi

if [ "$(cat "$STATE_FILE" 2>/dev/null)" != "fail" ]; then
  bash "$OPS/notify.sh" "**拾礼 · 需要人工**
$detail
自动重启后仍不可用。
日志：\`journalctl -u shili\` 或 \`docker compose -p shili logs api\`" || true
fi
echo fail > "$STATE_FILE"
exit 1
