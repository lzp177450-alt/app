import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { categories, brands, products, contact, demo } from './seed-data.js';

const dbPath = process.env.DB_PATH || resolve(process.cwd(), 'data/app.db');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA busy_timeout = 5000');
db.exec('PRAGMA foreign_keys = ON');
db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

export function now() {
  return new Date().toISOString();
}

export function tx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function getSetting(key, fallback = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value);
  } catch {
    return row.value;
  }
}

export function setSetting(key, value) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, JSON.stringify(value));
}

function seed() {
  const seeded = db.prepare('SELECT value FROM meta WHERE key = ?').get('seeded');
  if (seeded) return;

  tx(() => {
    const ts = now();

    const insCategory = db.prepare('INSERT INTO categories (id, name, sort) VALUES (?, ?, ?)');
    for (const c of categories) insCategory.run(c.id, c.name, c.sort);

    const insBrand = db.prepare('INSERT INTO brands (id, name, initial, pinyin, sort) VALUES (?, ?, ?, ?, ?)');
    for (const b of brands) insBrand.run(b.id, b.name, b.initial, b.pinyin, b.sort);

    const insProduct = db.prepare(`
      INSERT INTO products
        (id, name, sub, retail, code, brand, category, icon, tint, badge, dims, facts, specs, status, sort, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `);
    products.forEach((p, i) => {
      insProduct.run(
        p.id, p.name, p.sub, p.retail, p.code, p.brand, p.category,
        p.icon, p.tint, p.badge,
        JSON.stringify(p.dims), JSON.stringify(p.facts), JSON.stringify(p.specs),
        i, ts
      );
    });

    db.prepare('INSERT INTO enterprises (id, name, created_at) VALUES (?, ?, ?)')
      .run(demo.enterprise.id, demo.enterprise.name, ts);

    db.prepare('INSERT INTO users (id, openid, name, phone, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(demo.user.id, demo.user.openid, demo.user.name, demo.user.phone, ts);

    const insMembership = db.prepare(`
      INSERT INTO memberships (id, user_id, enterprise_id, role, label, desc, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of demo.memberships) {
      insMembership.run(m.id, demo.user.id, demo.enterprise.id, m.role, m.label, m.desc, ts);
    }

    const insAddress = db.prepare(`
      INSERT INTO addresses (id, user_id, name, phone, region, detail, is_default, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of demo.addresses) {
      insAddress.run(a.id, demo.user.id, a.name, a.phone, a.region, a.detail, a.is_default, ts);
    }

    db.prepare(`
      INSERT INTO invoices (user_id, type, title, tax_no, bank, account, addr, phone, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      demo.user.id, demo.invoice.type, demo.invoice.title, demo.invoice.taxNo,
      demo.invoice.bank, demo.invoice.account, demo.invoice.addr, demo.invoice.phone, ts
    );

    setSetting('contact', contact);
    db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('seeded', ts);
    db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('schema', '1');
  });
}

seed();

export function productRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    sub: row.sub,
    retail: row.retail,
    code: row.code,
    brand: row.brand,
    category: row.category,
    icon: row.icon,
    tint: row.tint,
    badge: row.badge,
    dims: JSON.parse(row.dims),
    facts: JSON.parse(row.facts),
    specs: JSON.parse(row.specs)
  };
}

export function selectionRow(row) {
  if (!row) return null;
  const items = db.prepare(
    'SELECT product_id AS productId, name, retail, qty FROM selection_items WHERE selection_id = ? ORDER BY id'
  ).all(row.id);
  return {
    id: row.id,
    no: row.no,
    status: row.status,
    note: row.note,
    total: row.total,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items
  };
}
