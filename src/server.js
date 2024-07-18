import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import { getContacts, getContactsById } from './services/contacts.js';

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

  server.set('json spaces', 2);

  server.get('/contacts', async (req, res) => {
    const contacts = await getContacts();
    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  server.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactsById(contactId);
      if (!contact) {
        res.status(404).json({
          message: 'Contact not found...',
        });
        return;
      }
      res.status(200).json({
        status: res.statusCode,
        data: contact,
        message: `Successfully found contact with id ${contactId}!`,
      });
    } catch (error) {
      next(error);
    }
  });

  server.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
