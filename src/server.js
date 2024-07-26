import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();
const PORT = Number(env('PORT', '3000'));

export function setupServer() {
  const server = express();
  server.use(cors());
  server.use(express.json());
  server.use(cookieParser());

  server.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  server.use('/api-docs', swaggerDocs());

  server.use(router);

  server.set('json spaces', 2);

  server.use('*', notFoundHandler);
  server.use(errorHandler);
  server.use('/uploads', express.static(UPLOAD_DIR));

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
