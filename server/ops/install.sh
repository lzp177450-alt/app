#!/usr/bin/env bash
# 首次安装：目录、.env、systemd、命令白名单。
# 用法（root）：bash /srv/apps/shili/app/server/ops/install.sh
set -euo pipefail

APP_DIR=${APP_DIR:-/srv/apps/shili}
REPO="$APP_DIR/app"
OPS="$REPO/server/ops"
SERVICE_USER=${SERVICE_USER:-deploy}

[ "$(id -u)" -eq 0 ] || { echo "请用 sudo 运行"; exit 1; }
[ -d "$REPO" ] || { echo "仓库不存在：$REPO"; exit 1; }

install -d -o "$SERVICE_USER" -g "$SERVICE_USER" \
  "$APP_DIR" "$APP_DIR/shared" "$APP_DIR/shared/db" \
  "$APP_DIR/shared/uploads" "$APP_DIR/shared/caddy" "$APP_DIR/logs"

if [ ! -f "$APP_DIR/.env" ]; then
  JWT=$(head -c 32 /dev/urandom | base64 | tr -d '=+/' | cut -c1-40)
  OPS_VALUE=$(head -c 24 /dev/urandom | base64 | tr -d '=+/' | cut -c1-28)
  cat > "$APP_DIR/.env" <<EOF
PORT=3000
JWT_SECRET=$JWT
OPS_TOKEN=$OPS_VALUE
WX_APPID=
WX_SECRET=
ALLOW_DEV_LOGIN=1
WECHAT_WEBHOOK=
EOF
  chown "$SERVICE_USER:$SERVICE_USER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
  echo "已生成 $APP_DIR/.env"
fi

chmod +x "$OPS"/*.sh

cp "$OPS"/systemd/*.service "$OPS"/systemd/*.timer /etc/systemd/system/

for name in deploy rollback health api; do
  cat > "/usr/local/bin/shili-$name" <<EOF
#!/usr/bin/env bash
exec bash $OPS/$name.sh "\$@"
EOF
  chmod 755 "/usr/local/bin/shili-$name"
done

cat > /etc/sudoers.d/shili <<'EOF'
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
deploy ALL=(root) NOPASSWD: /usr/local/bin/shili-deploy, /usr/local/bin/shili-rollback, /usr/local/bin/shili-health, /usr/local/bin/shili-api
EOF
chmod 440 /etc/sudoers.d/shili
visudo -cf /etc/sudoers.d/shili >/dev/null

systemctl daemon-reload
systemctl enable --now shili.service shili-health.timer shili-backup.timer shili-inspect.timer

echo "安装完成"
systemctl list-timers 'shili-*' --no-pager
