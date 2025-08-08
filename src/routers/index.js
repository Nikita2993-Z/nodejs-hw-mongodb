import { Router } from 'express';
import contactsRouter from './contacts.js';

const router = Router();

router.use(contactsRouter);

export default router;