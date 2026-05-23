import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, run_at TEXT NOT NULL)`);
  const dir = join(__dirname, 'migrations');
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    if (db.prepare('SELECT 1 FROM schema_migrations WHERE filename = ?').get(file)) continue;
    db.exec(readFileSync(join(dir, file), 'utf8'));
    db.prepare('INSERT INTO schema_migrations (filename, run_at) VALUES (?, ?)').run(file, new Date().toISOString());
  }
}
