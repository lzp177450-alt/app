import { randomUUID } from 'node:crypto';
import { db, now, selectionRow, tx } from '../db.js';

function dayKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}${get('month')}${get('day')}`;
}

function nextNo() {
  const prefix = `SL${dayKey()}`;
  const row = db.prepare('SELECT COUNT(*) AS n FROM selections WHERE no LIKE ?').get(`${prefix}%`);
  return `${prefix}${String(row.n + 1).padStart(3, '0')}`;
}

export async function selectionRoutes(app) {
  app.post('/selections', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });

    const raw = Array.isArray(req.body?.items) ? req.body.items : [];
    const items = raw
      .map((it) => ({ productId: String(it.productId || ''), qty: Number(it.qty) }))
      .filter((it) => it.productId && Number.isInteger(it.qty) && it.qty > 0 && it.qty <= 999);

    if (!items.length) return reply.code(400).send({ error: 'empty_selection', message: '选品单至少需要一件商品' });
    if (items.length > 50) return reply.code(400).send({ error: 'too_many_items', message: '单次最多 50 件商品' });

    const pick = db.prepare("SELECT id, name, retail FROM products WHERE id = ? AND status = 'active'");
    const rows = [];
    for (const it of items) {
      const product = pick.get(it.productId);
      if (!product) return reply.code(400).send({ error: 'bad_product', message: `商品不存在：${it.productId}` });
      rows.push({ ...product, qty: it.qty });
    }

    const total = rows.reduce((sum, r) => sum + r.retail * r.qty, 0);
    const ts = now();

    const selection = tx(() => {
      const id = `sel_${randomUUID().slice(0, 10)}`;
      const no = nextNo();
      db.prepare(`
        INSERT INTO selections (id, no, user_id, membership_id, status, note, total, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
      `).run(id, no, req.user.id, req.user.membership?.id || null, String(req.body?.note || '').slice(0, 500), total, ts, ts);

      const insItem = db.prepare(
        'INSERT INTO selection_items (selection_id, product_id, name, retail, qty) VALUES (?, ?, ?, ?, ?)'
      );
      for (const r of rows) insItem.run(id, r.id, r.name, r.retail, r.qty);

      return db.prepare('SELECT * FROM selections WHERE id = ?').get(id);
    });

    reply.code(201);
    return selectionRow(selection);
  });

  app.get('/selections', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const status = String(req.query?.status || '');
    const allowed = ['pending', 'quoted', 'deal', 'closed'];

    const rows = status && allowed.includes(status)
      ? db.prepare('SELECT * FROM selections WHERE user_id = ? AND status = ? ORDER BY created_at DESC')
        .all(req.user.id, status)
      : db.prepare('SELECT * FROM selections WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);

    const items = rows.map(selectionRow);
    const counts = db.prepare('SELECT status, COUNT(*) AS n FROM selections WHERE user_id = ? GROUP BY status')
      .all(req.user.id);
    const stats = { all: items.length, pending: 0, quoted: 0, deal: 0, closed: 0 };
    for (const c of counts) stats[c.status] = c.n;
    return { items, stats };
  });

  app.get('/selections/:id', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const row = db.prepare('SELECT * FROM selections WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '记录不存在' });
    return selectionRow(row);
  });

  app.post('/selections/:id/close', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const row = db.prepare('SELECT * FROM selections WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '记录不存在' });
    if (row.status === 'deal') return reply.code(409).send({ error: 'locked', message: '已成交的记录不能关闭' });
    if (row.status !== 'closed') {
      db.prepare("UPDATE selections SET status = 'closed', updated_at = ? WHERE id = ?").run(now(), row.id);
    }
    return selectionRow(db.prepare('SELECT * FROM selections WHERE id = ?').get(row.id));
  });
}
