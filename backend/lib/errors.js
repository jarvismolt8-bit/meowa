export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.status ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
}
