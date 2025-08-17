import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  getContactsPaginated,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = (req, res, next) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  getContactsPaginated({ page, perPage, sortBy, sortOrder, type, isFavourite })
    .then(
      ({
        items,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      }) => {
        res.status(200).json({
          status: 200,
          message: 'Successfully found contacts!',
          data: {
            data: items,
            page,
            perPage,
            totalItems,
            totalPages,
            hasPreviousPage,
            hasNextPage,
          },
        });
      },
    )
    .catch(next);
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with ${contactId} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(404).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
