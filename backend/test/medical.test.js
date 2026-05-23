import { describe, it, expect, vi, beforeAll } from 'vitest';
import { dbMock, buildApp } from './helpers.js';

vi.mock('../db/index.js', () => dbMock());

let request;
let catId;

beforeAll(async () => {
  request = await buildApp();
  // Create a cat to attach medical entries to
  const res = await request.post('/api/cats').send({ name: 'MedTestCat' });
  catId = res.body.id;
});

describe('GET /api/cats/:catId/medical', () => {
  it('returns 200 + paginated shape for a new cat', async () => {
    const res = await request.get(`/api/cats/${catId}/medical`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ data: [], total: 0, limit: 20, offset: 0 });
  });
});

describe('POST /api/cats/:catId/medical', () => {
  it('returns 201 for a valid body', async () => {
    const res = await request
      .post(`/api/cats/${catId}/medical`)
      .send({ date: '2025-01-15', notes: 'Annual checkup' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ date: '2025-01-15', notes: 'Annual checkup' });
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when notes is missing', async () => {
    const res = await request
      .post(`/api/cats/${catId}/medical`)
      .send({ date: '2025-01-15' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /api/cats/:catId/medical/:id', () => {
  it('returns 200 with updated entry for valid body', async () => {
    const create = await request
      .post(`/api/cats/${catId}/medical`)
      .send({ date: '2025-02-10', notes: 'Initial visit' });
    const mid = create.body.id;

    const res = await request
      .put(`/api/cats/${catId}/medical/${mid}`)
      .send({ date: '2025-02-11', notes: 'Follow-up visit' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ date: '2025-02-11', notes: 'Follow-up visit' });
  });

  it('returns 404 for a non-existent medical entry id', async () => {
    const res = await request
      .put(`/api/cats/${catId}/medical/99999`)
      .send({ date: '2025-01-01', notes: 'Ghost entry' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/cats/:catId/medical/:id', () => {
  it('returns 200 or 204 after deleting a medical entry', async () => {
    const create = await request
      .post(`/api/cats/${catId}/medical`)
      .send({ date: '2025-03-05', notes: 'Tooth cleaning' });
    const mid = create.body.id;

    const res = await request.delete(`/api/cats/${catId}/medical/${mid}`);
    expect([200, 204]).toContain(res.status);
  });
});
