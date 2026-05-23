export const config = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_UPLOAD_BYTES: parseInt(process.env.MAX_UPLOAD_BYTES || (5 * 1024 * 1024).toString(), 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
