import { randomUUID } from 'node:crypto';
import { db, getSetting, now } from '../db.js';
import { membershipView } from '../auth.js';

function addressRow(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    region: row.region,
    detail: row.detail,
    isDefault: !!row.is_default
  };
}

function invoiceRow(row) {
  if (!row) return null;
  return {
    type: row.type,
    title: row.title,
    taxNo: row.tax_no,
    bank: row.bank,
    account: row.account,
    addr: row.addr,
    phone: row.phone
  };
}

function touchDefault(userId, keepId) {
  db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id <> ?').run(userId, keepId);
  db.prepare('UPDATE addresses SET is_default = 1 WHERE user_id = ? AND id = ?').run(userId, keepId);
}

export async function profileRoutes(app) {
  app.get('/profile', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const memberships = db.prepare('SELECT * FROM memberships WHERE user_id = ? ORDER BY rowid')
      .all(req.user.id).map(membershipView);
    const counts = db.prepare('SELECT status, COUNT(*) AS n FROM selections WHERE user_id = ? GROUP BY status')
      .all(req.user.id);
    const stats = { all: 0, pending: 0, quoted: 0, deal: 0, closed: 0 };
    for (const c of counts) {
      stats[c.status] = c.n;
      stats.all += c.n;
    }
    return {
      user: { id: req.user.id, name: req.user.name, phone: req.user.phone },
      membership: membershipView(req.user.membership),
      memberships,
      addresses: db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at')
        .all(req.user.id).map(addressRow),
      invoice: invoiceRow(db.prepare('SELECT * FROM invoices WHERE user_id = ?').get(req.user.id)),
      contact: getSetting('contact', {}),
      stats
    };
  });

  app.get('/contact', async () => getSetting('contact', {}));

  app.get('/addresses', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    return {
      items: db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at')
        .all(req.user.id).map(addressRow)
    };
  });

  app.post('/addresses', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const b = req.body || {};
    if (!b.name || !b.phone || !b.region) {
      return reply.code(400).send({ error: 'invalid_address', message: '姓名、电话、地区不能为空' });
    }
    const id = `a_${randomUUID().slice(0, 8)}`;
    db.prepare(`
      INSERT INTO addresses (id, user_id, name, phone, region, detail, is_default, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, String(b.name), String(b.phone), String(b.region), String(b.detail || ''), b.isDefault ? 1 : 0, now());

    if (b.isDefault) touchDefault(req.user.id, id);
    reply.code(201);
    return addressRow(db.prepare('SELECT * FROM addresses WHERE id = ?').get(id));
  });

  app.patch('/addresses/:id', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const row = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '地址不存在' });

    const b = req.body || {};
    db.prepare('UPDATE addresses SET name = ?, phone = ?, region = ?, detail = ?, is_default = ? WHERE id = ?')
      .run(
        String(b.name ?? row.name),
        String(b.phone ?? row.phone),
        String(b.region ?? row.region),
        String(b.detail ?? row.detail),
        b.isDefault ? 1 : row.is_default,
        row.id
      );
    if (b.isDefault) touchDefault(req.user.id, row.id);
    return addressRow(db.prepare('SELECT * FROM addresses WHERE id = ?').get(row.id));
  });

  app.delete('/addresses/:id', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const res = db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (!res.changes) return reply.code(404).send({ error: 'not_found', message: '地址不存在' });
    return { ok: true };
  });

  app.get('/invoice', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    return invoiceRow(db.prepare('SELECT * FROM invoices WHERE user_id = ?').get(req.user.id));
  });

  app.put('/invoice', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'unauthorized', message: '请先登录' });
    const b = req.body || {};
    const ts = now();
    db.prepare(`
      INSERT INTO invoices (user_id, type, title, tax_no, bank, account, addr, phone, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        type = excluded.type, title = excluded.title, tax_no = excluded.tax_no,
        bank = excluded.bank, account = excluded.account, addr = excluded.addr,
        phone = excluded.phone, updated_at = excluded.updated_at
    `).run(
      req.user.id, String(b.type || 'company'), String(b.title || ''), String(b.taxNo || ''),
      String(b.bank || ''), String(b.account || ''), String(b.addr || ''), String(b.phone || ''), ts
    );
    return invoiceRow(db.prepare('SELECT * FROM invoices WHERE user_id = ?').get(req.user.id));
  });
}
