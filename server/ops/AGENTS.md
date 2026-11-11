# 拾礼 · 运维手册

给云端 agent 的操作手册。只做这里写明的事，其他先问人。

## 应用是什么

| 项 | 值 |
|---|---|
| 组成 | 静态原型（`prototype/`）+ Node API（`server/`）+ Caddy |
| 访问 | http://1.13.92.68/ ，接口同域 `/api/*` |
| 仓库 | https://github.com/lzp177450-alt/app.git （main） |
| 部署目录 | `/srv/apps/shili/app` |
| 数据 | `/srv/apps/shili/shared/db/app.db` |
| 备份 | `/srv/apps/shili/shared/db/backups` |
| 日志 | `docker compose -p shili logs` |
| 服务 | `shili.service`（整套）、`shili-health.timer`（2 分钟）、`shili-backup.timer`（03:30）、`shili-inspect.timer`（09:00） |
| 巡检报告 | `/srv/apps/shili/logs/inspect-YYYY-MM-DD.md` |

Compose 文件固定在 `/srv/apps/shili/app/server/docker-compose.yml`，项目名 `shili`。

## 你能执行的命令

```bash
sudo shili-deploy                 # 拉 main 并重建，约 1–2 分钟
sudo shili-rollback               # 回滚到上一版
sudo shili-rollback <commit>      # 回滚到指定提交
sudo shili-health                 # 体检，失败会尝试重启 api

# 带运维口令调接口（不用手写 token）
sudo shili-api GET /admin/stats
sudo shili-api GET /admin/selections?status=pending
sudo shili-api PATCH /admin/selections/<id> '{"status":"quoted"}'
```

## 选品单流转

状态只有四个：`pending`（待跟进）→ `quoted`（已报价）→ `deal`（已成交），任意阶段可 `closed`（已关闭）。

- 用户说「这单已经报价了」→ 改成 `quoted`
- 用户说「成交了」→ 改成 `deal`
- 用户说「不做了」→ 改成 `closed`
- 改之前先用 `GET /admin/selections` 找到对应编号，改完回报单号和新状态

只读排查：

```bash
systemctl status shili --no-pager
docker compose -p shili -f /srv/apps/shili/app/server/docker-compose.yml ps
docker compose -p shili -f /srv/apps/shili/app/server/docker-compose.yml logs --tail 100 api
curl -s http://127.0.0.1/api/health
df -h / ; free -m
```

## 禁止

- 不要读取、打印、修改 `/srv/apps/shili/.env`（需要运维口令时用 `shili-api`，不要手工拼 token）
- 不要 `rm -rf`、不要 `docker system prune`、不要 `docker run`
- 不要手动改数据库结构；迁移写在代码里，随发布执行
- 不要改 Caddyfile 的端口和 `/api` 反代规则
- 不要动 `/srv/apps/shili` 以外的文件
- 不要在服务器上再开第二个 agent 会话

## 排查顺序

1. `systemctl is-active shili` —— 没起就 `systemctl start shili`
2. `docker compose ... ps` —— 看 api / caddy 是否 healthy
3. `curl -s http://127.0.0.1/api/health` —— 区分是 API 挂了还是 Caddy 挂了
4. `docker compose ... logs --tail 100 api` —— 看具体报错
5. `df -h /`、`free -m` —— 磁盘满或 OOM 也会让服务假死

## 常见故障

| 现象 | 多半是 | 处理 |
|---|---|---|
| 首页 502 | caddy 没起或 api 不健康 | `docker compose ... up -d` |
| 首页 404 | prototype 目录没挂进 caddy | 检查 compose 的 volumes |
| 接口 401 | JWT_SECRET 变了，旧 token 失效 | 让用户重新登录 |
| 接口 503 | 数据库没起来 | 看 api 日志里的 SQLite 报错 |
| 部署卡住 | 服务器拉不到镜像或 npm | 检查 `docker pull` 与 npmmirror |

## 数据库恢复

```bash
COMPOSE="docker compose -p shili -f /srv/apps/shili/app/server/docker-compose.yml"
sudo $COMPOSE stop api
sudo cp /srv/apps/shili/shared/db/app.db /srv/apps/shili/shared/db/app.db.before-restore
sudo cp /srv/apps/shili/shared/db/backups/app-<时间>.db /srv/apps/shili/shared/db/app.db
sudo $COMPOSE start api
```

恢复前先把当前 `app.db` 改名留底，别直接覆盖。备份文件属于 root，操作要带 `sudo`。

手动备份：`sudo systemctl start shili-backup.service`，文件落在 `/srv/apps/shili/shared/db/backups`。

## 发布规则

- 只有 `main` 分支会部署
- 发布前自动备份数据库
- 健康检查 90 秒不过就失败，失败后可以 `sudo shili-rollback`
- 需要强制重建（commit 没变）：`FORCE=1 sudo shili-deploy`

## 对用户汇报

- 发布：说版本号、结果、地址
- 故障：说现象、已做的处理、是否需要人工
- 不要贴密钥、token、完整日志里的敏感字段
