import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (isHttpError(err)) {
    const payload = {
      status: err.status,
      message: err.expose ? err.message || 'Error' : 'Error',
    };
    if (err.errors || (err?.data && err.data.errors)) {
      payload.errors = err.errors ?? err.data.errors;
    }
    return res.status(err.status).json(payload);
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'MongooseError',
      errors: [{ message: err.message }],
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    errors: [{ message: err.message }],
  });
};
