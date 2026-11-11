PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS enterprises (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  openid      TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL DEFAULT '',
  avatar      TEXT,
  phone       TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enterprise_id  TEXT REFERENCES enterprises(id),
  role           TEXT NOT NULL CHECK (role IN ('employee', 'buyer', 'personal')),
  label          TEXT NOT NULL,
  desc           TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

CREATE TABLE IF NOT EXISTS categories (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  sort  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brands (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  initial  TEXT NOT NULL,
  pinyin   TEXT NOT NULL,
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  sub         TEXT NOT NULL DEFAULT '',
  retail      INTEGER NOT NULL,
  code        TEXT UNIQUE,
  brand       TEXT NOT NULL DEFAULT '',
  category    TEXT REFERENCES categories(id),
  icon        TEXT NOT NULL DEFAULT '',
  tint        INTEGER NOT NULL DEFAULT 1,
  badge       TEXT NOT NULL DEFAULT '',
  dims        TEXT NOT NULL DEFAULT '[]',
  facts       TEXT NOT NULL DEFAULT '[]',
  specs       TEXT NOT NULL DEFAULT '[]',
  status      TEXT NOT NULL DEFAULT 'active',
  sort        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

CREATE TABLE IF NOT EXISTS selections (
  id             TEXT PRIMARY KEY,
  no             TEXT NOT NULL UNIQUE,
  user_id        TEXT NOT NULL REFERENCES users(id),
  membership_id  TEXT REFERENCES memberships(id),
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'quoted', 'deal', 'closed')),
  note           TEXT NOT NULL DEFAULT '',
  total          INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_selections_user ON selections(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_selections_status ON selections(status);

CREATE TABLE IF NOT EXISTS selection_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  selection_id   TEXT NOT NULL REFERENCES selections(id) ON DELETE CASCADE,
  product_id     TEXT NOT NULL,
  name           TEXT NOT NULL,
  retail         INTEGER NOT NULL,
  qty            INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_selection_items ON selection_items(selection_id);

CREATE TABLE IF NOT EXISTS addresses (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  region      TEXT NOT NULL,
  detail      TEXT NOT NULL,
  is_default  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  user_id  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  type     TEXT NOT NULL DEFAULT 'company',
  title    TEXT NOT NULL DEFAULT '',
  tax_no   TEXT NOT NULL DEFAULT '',
  bank     TEXT NOT NULL DEFAULT '',
  account  TEXT NOT NULL DEFAULT '',
  addr     TEXT NOT NULL DEFAULT '',
  phone    TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);
