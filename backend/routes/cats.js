import { Router } from 'express';
import { getDb } from '../db/index.js';
import { computeNextCheckup } from '../lib/checkup.js';

const router = Router();

function rowToCat(row) {
  if (!row) return null;
  return {
    ...row,
    favorite_foods: row.favorite_foods ? JSON.parse(row.favorite_foods) : [],
    next_checkup_due: computeNextCheckup(row.last_checkup),
  };
}

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cats ORDER BY id DESC').all();
  res.json(rows.map(rowToCat));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  if (!row) return res.sendStatus(404);
  res.json(rowToCat(row));
});

router.post('/', (req, res) => {
  const { name, age, details, favorite_foods, last_checkup, photo_path } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const now = new Date().toISOString();
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO cats (name, age, details, favorite_foods, last_checkup, photo_path, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    name,
    age ?? null,
    details ?? null,
    favorite_foods ? JSON.stringify(favorite_foods) : null,
    last_checkup ?? null,
    photo_path ?? null,
    now,
    now,
  );
  const row = db.prepare('SELECT * FROM cats WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(rowToCat(row));
});

router.put('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  if (!existing) return res.sendStatus(404);

  const { name, age, details, favorite_foods, last_checkup, photo_path } = req.body;
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE cats SET name = ?, age = ?, details = ?, favorite_foods = ?, last_checkup = ?, photo_path = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(
    name ?? existing.name,
    age !== undefined ? age : existing.age,
    details !== undefined ? details : existing.details,
    favorite_foods !== undefined ? JSON.stringify(favorite_foods) : existing.favorite_foods,
    last_checkup !== undefined ? last_checkup : existing.last_checkup,
    photo_path !== undefined ? photo_path : existing.photo_path,
    now,
    req.params.id,
  );
  const row = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  res.json(rowToCat(row));
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM cats WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

export default router;
