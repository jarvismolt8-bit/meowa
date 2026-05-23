import { Router } from 'express';
import { getDb } from '../db/index.js';
import { computeNextCheckup, bucketByStatus } from '../lib/checkup.js';

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
  const cats = rows.map(rowToCat);
  const result = bucketByStatus(cats);
  res.json(result);
});

export default router;
