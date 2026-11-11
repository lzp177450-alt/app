import { db, productRow } from '../db.js';

const base = `WHERE status = 'active'`;

function listProducts(query) {
  const where = [base];
  const params = [];

  if (query.q) {
    where.push('(name LIKE ? OR sub LIKE ? OR brand LIKE ? OR code LIKE ?)');
    const like = `%${query.q}%`;
    params.push(like, like, like, like);
  }
  if (query.category && query.category !== 'all') {
    where.push('category = ?');
    params.push(query.category);
  }
  if (query.brand) {
    where.push('brand = ?');
    params.push(query.brand);
  }
  if (query.min != null && query.min !== '') {
    where.push('retail >= ?');
    params.push(Number(query.min));
  }
  if (query.max != null && query.max !== '') {
    where.push('retail <= ?');
    params.push(Number(query.max));
  }

  const order = query.sort === 'price_asc'
    ? 'retail ASC'
    : query.sort === 'price_desc'
      ? 'retail DESC'
      : 'sort ASC, name ASC';

  const sql = `SELECT * FROM products ${where.join(' AND ')} ORDER BY ${order}`;
  return db.prepare(sql).all(...params).map(productRow);
}

export async function catalogRoutes(app) {
  app.get('/products', async (req) => {
    const items = listProducts(req.query || {});
    return { items, total: items.length };
  });

  app.get('/products/:id', async (req, reply) => {
    const row = db.prepare("SELECT * FROM products WHERE id = ? AND status = 'active'").get(req.params.id);
    if (!row) return reply.code(404).send({ error: 'not_found', message: '商品不存在' });
    return productRow(row);
  });

  app.get('/categories', async () => {
    const counts = db.prepare("SELECT category, COUNT(*) AS n FROM products WHERE status = 'active' GROUP BY category").all();
    const map = Object.fromEntries(counts.map((r) => [r.category, r.n]));
    const items = db.prepare('SELECT id, name FROM categories ORDER BY sort').all()
      .map((c) => ({ ...c, count: map[c.id] || 0 }));
    return { items };
  });

  app.get('/brands', async () => {
    const counts = db.prepare("SELECT brand, COUNT(*) AS n FROM products WHERE status = 'active' GROUP BY brand").all();
    const map = Object.fromEntries(counts.map((r) => [r.brand, r.n]));
    const items = db.prepare('SELECT id, name, initial, pinyin FROM brands ORDER BY initial, pinyin').all()
      .map((b) => ({ ...b, count: map[b.name] || 0 }));
    return { items };
  });

  app.get('/catalog', async (req) => {
    const categories = db.prepare('SELECT id, name FROM categories ORDER BY sort').all();
    const brands = db.prepare('SELECT id, name, initial, pinyin FROM brands ORDER BY initial, pinyin').all();
    return {
      categories,
      brands,
      products: listProducts(req.query || {})
    };
  });
}
