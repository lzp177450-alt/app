#!/usr/bin/env bash
# 带运维口令调接口，避免在对话里传 token。
# 用法：api.sh GET /admin/stats
#       api.sh PATCH /admin/selections/<id> '{"status":"quoted"}'
set -euo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
METHOD=${1:-GET}
PATH_=${2:-/health}
BODY=${3:-}

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

if [ -n "$BODY" ]; then
  curl -fsS -X "$METHOD" -H "x-ops-token: ${OPS_TOKEN:-}" \
    -H 'content-type: application/json' -d "$BODY" "http://127.0.0.1/api$PATH_"
else
  curl -fsS -X "$METHOD" -H "x-ops-token: ${OPS_TOKEN:-}" "http://127.0.0.1/api$PATH_"
fi
echo
