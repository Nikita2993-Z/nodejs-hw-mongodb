import createHttpError from "http-errors";

export const notFoundMiddleware = (req, res, next) => {
    next(createHttpError(404, 'Route not found'));
};