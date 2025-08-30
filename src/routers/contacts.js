import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
  uploadContactsPhotoController,
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
import { upload } from '../middlewares/multer.js';

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
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactsRouter.delete(
  '/:contactId',
  isValidId('contactId'),
  ctrlWrapper(deleteContactController),
);
contactsRouter.put(
  '/:contactId/photo',
  upload.single('photo'),
  ctrlWrapper(uploadContactsPhotoController),
);
contactsRouter.patch(
  '/:contactId',
  isValidId('contactId'),
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
