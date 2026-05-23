import { describe, it, expect, vi, beforeAll } from 'vitest';
import { dbMock, buildApp } from './helpers.js';

vi.mock('../db/index.js', () => dbMock());

let request;
beforeAll(async () => {
  request = await buildApp();
});

describe('GET /api/cats', () => {
  it('returns 200 + empty array when no cats exist', async () => {
    const res = await request.get('/api/cats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/cats', () => {
  it('returns 201 + cat object with id for valid body', async () => {
    const res = await request.post('/api/cats').send({ name: 'Whiskers' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Whiskers' });
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 with error field for empty body', async () => {
    const res = await request.post('/api/cats').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/cats/:id', () => {
  it('returns 200 + cat after creation', async () => {
    const create = await request.post('/api/cats').send({ name: 'Luna' });
    const { id } = create.body;
    const res = await request.get(`/api/cats/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, name: 'Luna' });
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request.get('/api/cats/99999');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/cats/:id', () => {
  it('returns 200 or 204 after deleting a cat', async () => {
    const create = await request.post('/api/cats').send({ name: 'Mittens' });
    const { id } = create.body;
    const res = await request.delete(`/api/cats/${id}`);
    expect([200, 204]).toContain(res.status);
  });
});
