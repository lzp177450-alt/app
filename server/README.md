# 拾礼 API

Node 24 + Fastify + SQLite（`node:sqlite`，无原生依赖）。给小程序和原型提供商品、身份、选品记录、资料四类接口。

## 本地跑

```bash
cd server
npm install
DB_PATH=./data/app.db JWT_SECRET=dev OPS_TOKEN=devops node src/server.js
node scripts/smoke.mjs http://127.0.0.1:3000 devops
```

首次启动自动建表并写入演示数据（8 个商品、27 个品牌、5 个分类、演示账号）。

## 接口

除标注外都返回 JSON，鉴权用 `Authorization: Bearer <token>`。

### 健康

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 探活，含商品数与运行时长 |

### 登录与身份

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/wx-login` | `{code, nickname?}`，返回 `token`、`user`、`membership` |
| POST | `/api/auth/identity` | `{membershipId}`，切换身份并换发 token |
| GET | `/api/auth/me` | 当前用户与全部身份 |

未配置 `WX_APPID` / `WX_SECRET` 时走开发模式：`openid = dev:<code>`。用 `code=demo` 登录即演示账号（员工 / 采购 / 个人三个身份）。

### 商品

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/products` | 支持 `q` `category` `brand` `min` `max` `sort=price_asc\|price_desc` |
| GET | `/api/products/:id` | 单个商品 |
| GET | `/api/categories` | 分类及数量 |
| GET | `/api/brands` | 品牌及数量 |
| GET | `/api/catalog` | 分类 + 品牌 + 商品一次返回 |

只有一个价格 `retail`（参考价），不按身份区分。

### 选品记录

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/selections` | `{items:[{productId,qty}], note}`，总价由服务端按 `retail` 计算 |
| GET | `/api/selections` | 支持 `status=pending\|quoted\|deal\|closed`，附各状态计数 |
| GET | `/api/selections/:id` | 单条详情 |
| POST | `/api/selections/:id/close` | 关闭（已成交不可关闭） |

### 资料

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/profile` | 用户 + 身份 + 地址 + 发票 + 对接人 + 选品统计 |
| GET | `/api/contact` | 对接人 |
| GET/POST | `/api/addresses` | 列表 / 新增 |
| PATCH/DELETE | `/api/addresses/:id` | 修改 / 删除 |
| GET/PUT | `/api/invoice` | 发票抬头 |

### 运维（需要 `x-ops-token`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/stats` | 商品、用户、选品单计数 |
| GET | `/api/admin/selections` | `status`、`limit` 过滤 |
| PATCH | `/api/admin/selections/:id` | `{status}` 改状态 |
| POST | `/api/admin/backup` | `VACUUM INTO` 热备份到 `/data/backups` |

## 部署

见 `ops/AGENTS.md`。服务器上：

```bash
sudo shili-deploy        # 发布 main
sudo shili-rollback      # 回滚
sudo shili-health        # 体检
```

## 数据结构

- `users` / `memberships` / `enterprises`：一个用户可挂多个身份
- `products` / `brands` / `categories`：商品只有一个 `retail`
- `selections` / `selection_items`：选品单，状态 `pending → quoted → deal / closed`，商品价格在提交时快照
- `addresses` / `invoices` / `settings`：资料与配置

没有订单、支付、退款表。需要交易时再加，不动现有结构。
