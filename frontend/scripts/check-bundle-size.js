import { readdirSync, readFileSync } from 'fs';
import { gzipSync } from 'zlib';
import { join } from 'path';

const assetsDir = new URL('../dist/assets', import.meta.url).pathname;
const MAX_BYTES = 250 * 1024;

let files;
try { files = readdirSync(assetsDir); } catch { console.log('No dist/ found — run npm run build first'); process.exit(0); }

const mainChunks = files.filter(f => f.endsWith('.js') && !f.includes('vendor'));
for (const file of mainChunks) {
  const raw = readFileSync(join(assetsDir, file));
  const gz = gzipSync(raw);
  const kb = (gz.length / 1024).toFixed(1);
  console.log(`${file}: ${kb}KB gzipped`);
  if (gz.length > MAX_BYTES) { console.error(`FAIL: ${file} exceeds 250KB gzipped (${kb}KB)`); process.exit(1); }
}
console.log('Bundle size OK');
