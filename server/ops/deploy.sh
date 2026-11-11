#!/usr/bin/env bash
# 发布：拉取 main、备份数据库、重建容器、等健康检查。
set -euo pipefail

# 发布过程中会 git reset 当前脚本，先把自身读进内存再执行
if [ "${SHILI_SELF:-}" != "1" ]; then
  SHILI_SELF=1 exec bash -c "$(cat "$0")" shili-deploy "$@"
fi

APP_DIR=${APP_DIR:-/srv/apps/shili}
REPO="$APP_DIR/app"
BRANCH=${BRANCH:-main}
OPS="$REPO/server/ops"
COMPOSE="docker compose -p shili -f $REPO/server/docker-compose.yml"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
notify() { bash "$OPS/notify.sh" "$@" || true; }

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

cd "$REPO"
if ! git fetch --depth=1 origin "$BRANCH" >/dev/null 2>&1; then
  log "git fetch 失败"
  notify "**拾礼 · 部署失败**
拉取代码失败，服务器无法访问 GitHub。"
  exit 1
fi

PREV_FULL=$(git rev-parse HEAD)
REMOTE_FULL=$(git rev-parse "origin/$BRANCH")
PREV=$(git rev-parse --short "$PREV_FULL")

if [ "$PREV_FULL" = "$REMOTE_FULL" ] && [ "${FORCE:-0}" != "1" ]; then
  log "已是最新 $PREV，跳过"
  exit 0
fi

git reset --hard "$REMOTE_FULL" >/dev/null
NEW=$(git rev-parse --short HEAD)
log "代码 $PREV -> $NEW"

if curl -fsS -m 30 -X POST -H "x-ops-token: ${OPS_TOKEN:-}" http://127.0.0.1/api/admin/backup >/dev/null 2>&1; then
  log "数据库已备份"
else
  log "跳过升级前备份（旧版本不可用）"
fi

if ! APP_VERSION="$NEW" $COMPOSE up -d --build; then
  log "容器构建失败"
  notify "**拾礼 · 部署失败**
版本：\`$NEW\`
\`\`\`
$($COMPOSE logs --tail 20 api 2>&1 | tail -20)
\`\`\`"
  exit 1
fi

for _ in $(seq 1 45); do
  if curl -fsS -m 3 http://127.0.0.1/api/health >/dev/null 2>&1; then
    log "部署完成 $NEW"
    install -m 644 -o deploy -g deploy "$OPS/AGENTS.md" /srv/workspaces/shili/AGENTS.md 2>/dev/null || true
    notify "**拾礼 · 部署成功**
版本：\`$NEW\`
上一版：\`$PREV\`
地址：http://1.13.92.68/"
    exit 0
  fi
  sleep 2
done

log "健康检查未通过"
notify "**拾礼 · 部署失败**
版本：\`$NEW\`
健康检查 90 秒未通过，最后日志：
\`\`\`
$($COMPOSE logs --tail 20 api 2>&1 | tail -20)
\`\`\`"
exit 1
