/**
 * Test helpers — creates a fresh in-memory SQLite DB for each test suite
 * and returns a supertest-wrapped Express app wired to that DB.
 *
 * Usage (in a *.test.js file):
 *
 *   import { vi } from 'vitest';
 *   vi.mock('../db/index.js', () => import('./helpers.js').then(m => m.dbMock()));
 *   const { buildApp } = await import('./helpers.js');
 *   const request = await buildApp();
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supertest from 'supertest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '..', 'db', 'schema.sql');

/**
 * Creates a fresh in-memory better-sqlite3 database with the schema applied.
 * @returns {import('better-sqlite3').Database}
 */
export function createTestDb() {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  return db;
}

/**
 * Returns a vitest mock factory for ../db/index.js.
 * Call this inside vi.mock():
 *
 *   vi.mock('../db/index.js', () => dbMock());
 *
 * @returns {{ getDb: () => Database, closeDb: () => void, runMigrations: () => void }}
 */
export function dbMock() {
  const db = createTestDb();
  return {
    getDb: () => db,
    closeDb: () => db.close(),
    runMigrations: () => {},
  };
}

/**
 * Builds the Express app with a fresh in-memory DB injected via vi.mock,
 * wraps it in supertest, and returns the supertest agent.
 *
 * NOTE: You must call vi.mock('../db/index.js', dbMockFactory) BEFORE
 * importing the app — this helper takes care of that if you use buildApp()
 * from a test file that already has the mock in place.
 *
 * @returns {Promise<import('supertest').SuperTest<import('supertest').Test>>}
 */
export async function buildApp() {
  // Dynamically import the app after the mock is in place.
  const { default: app } = await import('../app.js');
  return supertest(app);
}
