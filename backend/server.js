import { config } from './lib/config.js';
import { logger } from './lib/logger.js';
import { runMigrations, closeDb } from './db/index.js';
import app from './app.js';

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
