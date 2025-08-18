import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (!error) {
    req.body = value;
    return next();
  }
  const errors = error.details.map((d) => ({
    path: d.path.join('.'),
    message: d.message,
    type: d.type,
  }));
  return next(createHttpError(400, { message: 'Validation error', errors }));
};
