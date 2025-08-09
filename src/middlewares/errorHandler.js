import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddleware = (err, req, res, next ) => {
    if(isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err.message,
    });
}
if(err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'MongooseError',
      data: err.message,
    });
}
res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,
  });
};