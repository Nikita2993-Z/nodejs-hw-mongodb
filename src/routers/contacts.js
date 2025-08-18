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

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  validateQuery(contactsListQuerySchema),
  ctrlWrapper(getContactsController),
);
contactsRouter.get(
  '/contacts/:contactId',
  isValidId('contactId'),
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactsRouter.delete(
  '/contacts/:contactId',
  isValidId('contactId'),
  ctrlWrapper(deleteContactController),
);
contactsRouter.put(
  '/contacts/:contactId',
  isValidId('contactId'),
  ctrlWrapper(upsertContactController),
);
contactsRouter.patch(
  '/contacts/:contactId',
  // isValidId('contactId'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
