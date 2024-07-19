import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import router from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();
const PORT = Number(env('PORT', '3000'));

export function setupServer() {
  const server = express();
  server.use(cors());

  server.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  server.use(router);

  server.set('json spaces', 2);

  server.use('*', notFoundHandler);
  server.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
