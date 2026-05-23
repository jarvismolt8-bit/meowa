CREATE TABLE IF NOT EXISTS cats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER,
  details TEXT,
  favorite_foods TEXT,
  last_checkup TEXT,
  photo_path TEXT,
  owner_id INTEGER DEFAULT 1,
  created_at TEXT,
  updated_at TEXT
);
