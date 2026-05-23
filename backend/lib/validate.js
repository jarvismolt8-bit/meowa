import { HttpError } from './errors.js';

export const validate = (schema) => (req, res, next) => {
  try { schema.parse(req.body); next(); }
  catch (e) { next(new HttpError(400, e.errors ? JSON.stringify(e.errors) : e.message)); }
};
