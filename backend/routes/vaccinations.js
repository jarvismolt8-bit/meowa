import { Router } from 'express';
import { getDb } from '../db/index.js';
import { HttpError } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import { createVaccinationSchema, updateVaccinationSchema } from '../lib/schemas/vaccination.js';

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
    const rows = db.prepare('SELECT * FROM vaccinations WHERE cat_id = ? ORDER BY date DESC').all(req.params.id);
    res.json(rows);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.post('/', requireCat, validate(createVaccinationSchema), (req, res, next) => {
  try {
    const { name, date } = req.body;
    const now = new Date().toISOString();
    const db = getDb();
    const stmt = db.prepare('INSERT INTO vaccinations (cat_id, name, date, created_at) VALUES (?, ?, ?, ?)');
    const result = stmt.run(req.params.id, name, date, now);
    const row = db.prepare('SELECT * FROM vaccinations WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.put('/:vid', requireCat, validate(updateVaccinationSchema), (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM vaccinations WHERE id = ? AND cat_id = ?').get(req.params.vid, req.params.id);
    if (!existing) return next(new HttpError(404, 'Vaccination not found'));

    const { name, date } = req.body;
    const stmt = db.prepare('UPDATE vaccinations SET name = ?, date = ? WHERE id = ? AND cat_id = ?');
    stmt.run(
      name !== undefined ? name : existing.name,
      date !== undefined ? date : existing.date,
      req.params.vid,
      req.params.id,
    );
    const row = db.prepare('SELECT * FROM vaccinations WHERE id = ?').get(req.params.vid);
    res.json(row);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.delete('/:vid', requireCat, (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM vaccinations WHERE id = ? AND cat_id = ?').run(req.params.vid, req.params.id);
    if (result.changes === 0) return next(new HttpError(404, 'Not found'));
    res.sendStatus(204);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

export default router;
