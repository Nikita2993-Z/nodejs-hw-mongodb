import crypto from 'node:crypto';

export const requestIdMiddleware = (res, req, next) => {
    req.id = crypto.randomUUID();
    next();
};