import { Router } from 'express';
import { unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../db/index.js';
import { computeNextCheckup } from '../lib/checkup.js';
import { HttpError } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import { createCatSchema, updateCatSchema } from '../lib/schemas/cat.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const router = Router();

function rowToCat(row) {
  if (!row) return null;
  return {
    ...row,
    favorite_foods: row.favorite_foods ? JSON.parse(row.favorite_foods) : [],
    next_checkup_due: computeNextCheckup(row.last_checkup),
  };
}

router.get('/', (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const db = getDb();
    const total = db.prepare('SELECT COUNT(*) as n FROM cats').get().n;
    const rows = db.prepare('SELECT * FROM cats ORDER BY id DESC LIMIT ? OFFSET ?').all(limit, offset);
    res.json({ data: rows.map(rowToCat), total, limit, offset });
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
    if (!row) return next(new HttpError(404, 'Not found'));
    res.json(rowToCat(row));
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.post('/', validate(createCatSchema), (req, res, next) => {
  try {
    const { name, age, details, favorite_foods, last_checkup, photo_path } = req.body;
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
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.put('/:id', validate(updateCatSchema), (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
    if (!existing) return next(new HttpError(404, 'Not found'));

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
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
    if (!row) return next(new HttpError(404, 'Not found'));
    db.prepare('DELETE FROM cats WHERE id = ?').run(req.params.id);
    if (row.photo_path) {
      const filename = path.basename(row.photo_path);
      await unlink(path.join(UPLOADS_DIR, filename)).catch(() => {});
    }
    res.sendStatus(204);
  } catch (e) {
    next(new HttpError(500, e.message));
  }
});

export default router;
