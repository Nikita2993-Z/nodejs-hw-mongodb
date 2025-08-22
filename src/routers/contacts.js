import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.schemas.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { contactsListQuerySchema } from '../validation/pagination.schema.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);
contactsRouter.get(
  '/',
  validateQuery(contactsListQuerySchema),
  ctrlWrapper(getContactsController),
);
contactsRouter.get(
  '/:contactId',
  isValidId('contactId'),
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactsRouter.delete(
  '/:contactId',
  isValidId('contactId'),
  ctrlWrapper(deleteContactController),
);
contactsRouter.put(
  '/:contactId',
  isValidId('contactId'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);
contactsRouter.patch(
  '/:contactId',
  isValidId('contactId'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
