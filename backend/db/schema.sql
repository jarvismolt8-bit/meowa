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

CREATE TABLE IF NOT EXISTS vaccinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cat_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT,
  FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medical_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cat_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TEXT,
  FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
);
