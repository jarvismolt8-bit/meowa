import { nanoid } from 'nanoid';

export function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || nanoid();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
