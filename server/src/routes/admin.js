import { mkdirSync, statSync } from 'node:fs';
import { db, now, selectionRow } from '../db.js';

const STATUS = ['pending', 'quoted', 'deal', 'closed'];
const OPS_TOKEN = process.env.OPS_TOKEN || '';

function opsGuard(req, reply) {
  if (!OPS_TOKEN) {
    reply.code(503).send({ error: 'ops_disabled', message: '未配置 OPS_TOKEN' });
    return false;
  }
  if (req.headers['x-ops-token'] !== OPS_TOKEN) {
    reply.code(401).send({ error: 'unauthorized', message: '运维口令不正确' });
    return false;
  }
}

export async function adminRoutes(app) {
  app.addHook('preHandler', async (req, reply) => {
    opsGuard(req, reply);
  });

  app.get('/stats', async () => {
    const products = db.prepare("SELECT COUNT(*) AS n FROM products WHERE status = 'active'").get().n;
    const users = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
    const byStatus = db.prepare('SELECT status, COUNT(*) AS n FROM selections GROUP BY status').all();
    const stats = { pending: 0, quoted: 0, deal: 0, closed: 0, all: 0 };
    for (const row of byStatus) {
      stats[row.status] = row.n;
      stats.all += row.n;
    }
    return { products, users, selections: stats };
  });

  app.get('/selections', async (req) => {
    const status = String(req.query?.status || '');
    const limit = Math.min(Number(req.query?.limit) || 50, 200);
    const rows = STATUS.includes(status)
      ? db.prepare('SELECT * FROM selections WHERE status = ? ORDER BY created_at DESC LIMIT ?').all(status, limit)
      : db.prepare('SELECT * FROM selections ORDER BY created_at DESC LIMIT ?').all(limit);
    return { items: rows.map(selectionRow) };
  });

  app.patch('/selections/:id', async (req, reply) => {
    const status = String(req.body?.status || '');
    if (!STATUS.includes(status)) {
      return reply.code(400).send({ error: 'bad_status', message: `status 只能是 ${STATUS.join(' / ')}` });
    }
    const row = db.prepare('SELECT * FROM selections WHERE id = ?').get(req.params.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '记录不存在' });
    db.prepare('UPDATE selections SET status = ?, updated_at = ? WHERE id = ?').run(status, now(), row.id);
    return selectionRow(db.prepare('SELECT * FROM selections WHERE id = ?').get(row.id));
  });

  app.post('/backup', async (req, reply) => {
    const dir = process.env.BACKUP_DIR || '/data/backups';
    try {
      mkdirSync(dir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const file = `${dir}/app-${stamp}.db`;
      db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
      return { ok: true, file, size: statSync(file).size };
    } catch (err) {
      return reply.code(500).send({ error: 'backup_failed', message: err.message });
    }
  });
}
