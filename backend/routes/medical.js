import { Router } from 'express';
import { getDb } from '../db/index.js';
import { HttpError } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import { createMedicalSchema, updateMedicalSchema } from '../lib/schemas/medical.js';

const router = Router({ mergeParams: true });

function requireCat(req, res, next) {
  try {
    const db = getDb();
    const cat = db.prepare('SELECT id FROM cats WHERE id = ?').get(req.params.id);
    if (!cat) return next(new HttpError(404, 'Cat not found'));
    next();
  } catch (e) {
    next(new HttpError(500, e.message));
  }
}

router.get('/', requireCat, (req, res, next) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM medical_entries WHERE cat_id = ? ORDER BY date DESC').all(req.params.id);
    res.json(rows);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.post('/', requireCat, validate(createMedicalSchema), (req, res, next) => {
  try {
    const { date, notes } = req.body;
    const now = new Date().toISOString();
    const db = getDb();
    const stmt = db.prepare('INSERT INTO medical_entries (cat_id, date, notes, created_at) VALUES (?, ?, ?, ?)');
    const result = stmt.run(req.params.id, date, notes, now);
    const row = db.prepare('SELECT * FROM medical_entries WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.put('/:mid', requireCat, validate(updateMedicalSchema), (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM medical_entries WHERE id = ? AND cat_id = ?').get(req.params.mid, req.params.id);
    if (!existing) return next(new HttpError(404, 'Medical entry not found'));

    const { date, notes } = req.body;
    const stmt = db.prepare('UPDATE medical_entries SET date = ?, notes = ? WHERE id = ? AND cat_id = ?');
    stmt.run(
      date !== undefined ? date : existing.date,
      notes !== undefined ? notes : existing.notes,
      req.params.mid,
      req.params.id,
    );
    const row = db.prepare('SELECT * FROM medical_entries WHERE id = ?').get(req.params.mid);
    res.json(row);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.delete('/:mid', requireCat, (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM medical_entries WHERE id = ? AND cat_id = ?').run(req.params.mid, req.params.id);
    if (result.changes === 0) return next(new HttpError(404, 'Not found'));
    res.sendStatus(204);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

export default router;
