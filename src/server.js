import express from "express";
import pino from "pino-http";
import cors from "cors";
import crypto from "node:crypto";
import { ENV_VARS } from "./constants/envVars.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import { getContactById, getContacts } from './services/contacts.js';




export const setupServer = () => {
    const app = express();
  
  app.use([
    (req, res, next) => {
      req.id = crypto.randomUUID();
      next();
    },
    pino(),
    cors(),
  ]);

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with ${contactId} not found!`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found!',
      status: 404,
    });
  });

  app.use('/', (err, req, res) => {
    res.status(500).json({
      status: 500,
      message: 'Oops error happened in application!',
      error: err.message,
    });
  });

  const PORT = getEnvVar(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    console.log(`Server is running in ${PORT} port!`);
  });
};