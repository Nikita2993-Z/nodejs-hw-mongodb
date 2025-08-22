import express, { json } from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { ENV_VARS } from './constants/envVars.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import router from './routers/index.js';
import { notFoundMiddleware } from './middlewares/notFound.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use([requestIdMiddleware, pino(), cors(), cookieParser()]);
  app.use(
    json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(router);

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = getEnvVar(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    console.log(`Server is running in ${PORT} port!`);
  });
};
