import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './lib/config.js';
import { logger } from './lib/logger.js';
import { requestId } from './lib/requestId.js';
import { errorHandler, notFoundHandler } from './lib/errors.js';
import { runMigrations, closeDb, getDb } from './db/index.js';
import catsRouter from './routes/cats.js';
import uploadsRouter from './routes/uploads.js';
import vaccinationsRouter from './routes/vaccinations.js';
import medicalRouter from './routes/medical.js';
import remindersRouter from './routes/reminders.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: config.MAX_UPLOAD_BYTES }));
app.use(requestId);

const morganStream = { write: (msg) => logger.info(msg.trim()) };
app.use(morgan('short', { stream: morganStream }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  let dbStatus = 'ok';
  try {
    const db = getDb();
    db.prepare('SELECT 1').get();
  } catch {
    dbStatus = 'error';
  }
  res.json({ status: 'ok', db: dbStatus, requestId: _req.requestId });
});

app.use('/api/cats', catsRouter);
app.use('/api/cats/:id/vaccinations', vaccinationsRouter);
app.use('/api/cats/:id/medical', medicalRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/uploads', uploadsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

runMigrations();

const server = app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, 'Backend started');
});

function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutting down');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
