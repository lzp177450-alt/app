#!/usr/bin/env bash
# 每日巡检：生成 Markdown 报告并推送摘要。
set -uo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
REPO="$APP_DIR/app"
OPS="$REPO/server/ops"
LOG_DIR="$APP_DIR/logs"
COMPOSE="docker compose -p shili -f $REPO/server/docker-compose.yml"
STAMP=$(date '+%Y-%m-%d')
FILE="$LOG_DIR/inspect-$STAMP.md"

mkdir -p "$LOG_DIR"

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

health=$(curl -fsS -m 5 http://127.0.0.1/api/health 2>/dev/null || echo '{"ok":false}')
stats=$(curl -fsS -m 5 -H "x-ops-token: ${OPS_TOKEN:-}" http://127.0.0.1/api/admin/stats 2>/dev/null || echo '{}')
containers=$($COMPOSE ps --format '{{.Service}} {{.Status}}' 2>/dev/null || echo 'compose 未运行')
disk=$(df -h / | awk 'NR==2 {print $5" ("$4" 可用)"}')
mem=$(free -h | awk '/^Mem:/ {print $3" / "$2}')
errors=$($COMPOSE logs --since 24h api 2>/dev/null | grep -ci 'error' || true)

{
  echo "# 拾礼巡检 $STAMP"
  echo
  echo "## 服务"
  echo '```'
  echo "$containers"
  echo '```'
  echo
  echo "- 健康检查：$health"
  echo "- 24 小时错误日志：${errors:-0} 条"
  echo
  echo "## 资源"
  echo "- 磁盘：$disk"
  echo "- 内存：$mem"
  echo
  echo "## 数据"
  echo '```'
  echo "$stats"
  echo '```'
  echo
  echo "## 最近日志"
  echo '```'
  $COMPOSE logs --tail 20 api 2>/dev/null | tail -20
  echo '```'
} > "$FILE"

ok=$(printf '%s' "$health" | grep -c '"ok":true')
if [ "$ok" -ge 1 ]; then
  bash "$OPS/notify.sh" "**拾礼 · 每日巡检 $STAMP**
服务正常。磁盘 $disk，24h 错误 ${errors:-0} 条。
报告：\`$FILE\`" || true
else
  bash "$OPS/notify.sh" "**拾礼 · 每日巡检 $STAMP**
**服务异常**：$health
报告：\`$FILE\`" || true
fi
