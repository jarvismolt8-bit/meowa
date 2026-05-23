import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { runMigrations } from './db/index.js';
import catsRouter from './routes/cats.js';
import uploadsRouter from './routes/uploads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/cats', catsRouter);
app.use('/api/uploads', uploadsRouter);

runMigrations();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
