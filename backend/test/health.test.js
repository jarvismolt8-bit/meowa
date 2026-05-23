import { describe, it, expect, vi } from 'vitest';
import supertest from 'supertest';

// Mock the db module before importing the app
const testDb = await import('./helpers.js').then(m => m.createTestDb());
vi.mock('../db/index.js', () => ({
  getDb: () => testDb,
  closeDb: () => {},
  runMigrations: () => {},
}));

const { default: app } = await import('../app.js');
const request = supertest(app);

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request.get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('ok');
  });
});
