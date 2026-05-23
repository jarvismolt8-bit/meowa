import { describe, it, expect, vi, beforeAll } from 'vitest';
import { dbMock, buildApp } from './helpers.js';

vi.mock('../db/index.js', () => dbMock());

let request;
let catId;

beforeAll(async () => {
  request = await buildApp();
  // Create a cat to attach vaccinations to
  const res = await request.post('/api/cats').send({ name: 'VaccTestCat' });
  catId = res.body.id;
});

describe('GET /api/cats/:catId/vaccinations', () => {
  it('returns 200 + empty array for a new cat', async () => {
    const res = await request.get(`/api/cats/${catId}/vaccinations`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/cats/:catId/vaccinations', () => {
  it('returns 201 for a valid body', async () => {
    const res = await request
      .post(`/api/cats/${catId}/vaccinations`)
      .send({ name: 'Rabies', date: '2025-01-01' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Rabies', date: '2025-01-01' });
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when date is missing', async () => {
    const res = await request
      .post(`/api/cats/${catId}/vaccinations`)
      .send({ name: 'Rabies' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /api/cats/:catId/vaccinations/:id', () => {
  it('returns 200 with updated vaccination for valid body', async () => {
    const create = await request
      .post(`/api/cats/${catId}/vaccinations`)
      .send({ name: 'FVRCP', date: '2025-02-01' });
    const vid = create.body.id;

    const res = await request
      .put(`/api/cats/${catId}/vaccinations/${vid}`)
      .send({ name: 'FVRCP Updated', date: '2025-03-01' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'FVRCP Updated', date: '2025-03-01' });
  });

  it('returns 404 for a non-existent vaccination id', async () => {
    const res = await request
      .put(`/api/cats/${catId}/vaccinations/99999`)
      .send({ name: 'X', date: '2025-01-01' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/cats/:catId/vaccinations/:id', () => {
  it('returns 200 or 204 after deleting a vaccination', async () => {
    const create = await request
      .post(`/api/cats/${catId}/vaccinations`)
      .send({ name: 'Bordetella', date: '2025-04-01' });
    const vid = create.body.id;

    const res = await request.delete(`/api/cats/${catId}/vaccinations/${vid}`);
    expect([200, 204]).toContain(res.status);
  });
});
