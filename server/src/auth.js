import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { db, now } from './db.js';

const SECRET = process.env.JWT_SECRET || 'shili-dev-secret-change-me';
const TTL = 60 * 60 * 24 * 30;
const DEV_MODE = !process.env.WX_APPID || !process.env.WX_SECRET;
const ALLOW_DEV = process.env.ALLOW_DEV_LOGIN === '1' || process.env.NODE_ENV !== 'production';

function b64(input) {
  return Buffer.from(input).toString('base64url');
}

export function signToken(payload) {
  const body = { ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + TTL };
  const head = b64(JSON.stringify(body));
  const sig = createHmac('sha256', SECRET).update(head).digest('base64url');
  return `${head}.${sig}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [head, sig] = token.split('.');
  const want = createHmac('sha256', SECRET).update(head).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(want);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const body = JSON.parse(Buffer.from(head, 'base64url').toString('utf8'));
    if (!body.exp || body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

export function currentUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = db.prepare('SELECT id, name, phone, avatar FROM users WHERE id = ?').get(payload.uid);
  if (!user) return null;
  const membership = payload.mid
    ? db.prepare('SELECT * FROM memberships WHERE id = ? AND user_id = ?').get(payload.mid, user.id)
    : null;
  return { ...user, membership: membership || defaultMembership(user.id) };
}

export function requireAuth(req, reply) {
  if (!req.user) {
    reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    return false;
  }
}

function defaultMembership(userId) {
  return db.prepare(`
    SELECT * FROM memberships
    WHERE user_id = ?
    ORDER BY CASE role WHEN 'employee' THEN 0 WHEN 'buyer' THEN 1 ELSE 2 END
    LIMIT 1
  `).get(userId) || null;
}

export function membershipView(row) {
  if (!row) return null;
  const ent = row.enterprise_id
    ? db.prepare('SELECT name FROM enterprises WHERE id = ?').get(row.enterprise_id)
    : null;
  return {
    id: row.id,
    role: row.role,
    label: row.label,
    desc: row.desc,
    enterprise: ent ? ent.name : null
  };
}

async function code2openid(code) {
  const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
  url.searchParams.set('appid', process.env.WX_APPID);
  url.searchParams.set('secret', process.env.WX_SECRET);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const data = await res.json();
  if (!data.openid) throw new Error(data.errmsg || '微信登录失败');
  return data.openid;
}

function upsertUser(openid, nickname) {
  const existing = db.prepare('SELECT * FROM users WHERE openid = ?').get(openid);
  if (existing) return existing;

  const id = `u_${randomUUID().slice(0, 8)}`;
  const ts = now();
  db.prepare('INSERT INTO users (id, openid, name, created_at) VALUES (?, ?, ?, ?)')
    .run(id, openid, nickname || '微信用户', ts);
  db.prepare(`
    INSERT INTO memberships (id, user_id, enterprise_id, role, label, desc, created_at)
    VALUES (?, ?, NULL, 'personal', '个人', '按参考价选购', ?)
  `).run(`m_${randomUUID().slice(0, 8)}`, id, ts);
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export async function authRoutes(app) {
  app.post('/wx-login', async (req, reply) => {
    const code = String(req.body?.code || '').trim();
    if (!code) return reply.code(400).send({ error: 'invalid_code', message: '缺少 code' });
    if (DEV_MODE && !ALLOW_DEV) {
      return reply.code(503).send({ error: 'wx_not_configured', message: '未配置微信登录，且未开启开发登录' });
    }

    let openid;
    try {
      openid = DEV_MODE ? `dev:${code}` : await code2openid(code);
    } catch (err) {
      return reply.code(401).send({ error: 'wx_login_failed', message: err.message });
    }

    const user = upsertUser(openid, req.body?.nickname);
    const membership = defaultMembership(user.id);
    const token = signToken({ uid: user.id, mid: membership ? membership.id : null });
    return {
      token,
      user: { id: user.id, name: user.name, phone: user.phone },
      membership: membershipView(membership),
      dev: DEV_MODE
    };
  });

  app.post('/identity', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const id = String(req.body?.membershipId || '');
    const row = db.prepare('SELECT * FROM memberships WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '身份不存在或不属于当前账号' });
    return {
      token: signToken({ uid: req.user.id, mid: row.id }),
      membership: membershipView(row)
    };
  });

  app.get('/me', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    return {
      user: { id: req.user.id, name: req.user.name, phone: req.user.phone },
      membership: membershipView(req.user.membership),
      memberships: db.prepare('SELECT * FROM memberships WHERE user_id = ? ORDER BY created_at, rowid')
        .all(req.user.id).map(membershipView)
    };
  });
}
