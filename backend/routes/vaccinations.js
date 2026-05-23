import { Router } from 'express';
import { getDb } from '../db/index.js';

const router = Router({ mergeParams: true });

function requireCat(req, res, next) {
  const db = getDb();
  const cat = db.prepare('SELECT id FROM cats WHERE id = ?').get(req.params.id);
  if (!cat) return res.sendStatus(404);
  next();
}

router.get('/', requireCat, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM vaccinations WHERE cat_id = ? ORDER BY date DESC').all(req.params.id);
  res.json(rows);
});

router.post('/', requireCat, (req, res) => {
  const { name, date } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'date is required' });
  }
  const now = new Date().toISOString();
  const db = getDb();
  const stmt = db.prepare('INSERT INTO vaccinations (cat_id, name, date, created_at) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.params.id, name, date, now);
  const row = db.prepare('SELECT * FROM vaccinations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.delete('/:vid', requireCat, (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM vaccinations WHERE id = ? AND cat_id = ?').run(req.params.vid, req.params.id);
  if (result.changes === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

export default router;
