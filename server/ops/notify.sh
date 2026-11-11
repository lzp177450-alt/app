#!/usr/bin/env bash
# 企业微信群机器人推送。用法：notify.sh "文本"
set -euo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

[ -z "${WECHAT_WEBHOOK:-}" ] && exit 0
[ $# -eq 0 ] && exit 0

payload=$(printf '%s' "$*" | node -e '
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  process.stdout.write(JSON.stringify({ msgtype: "markdown", markdown: { content: s } }));
});')

curl -fsS -m 8 -H 'Content-Type: application/json' -d "$payload" "$WECHAT_WEBHOOK" >/dev/null
