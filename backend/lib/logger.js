import pino from 'pino';
import { config } from './config.js';

const transport = pino.transport({
  target: 'pino/file',
  options: { destination: 1 },
});

export const logger = pino(
  { level: config.LOG_LEVEL },
  transport,
);

export function childLogger(requestId) {
  return logger.child({ requestId });
}
