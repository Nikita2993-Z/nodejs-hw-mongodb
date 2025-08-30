import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContactById,
  getContactsPaginated,
  updateContact,
  uploadContactsPhoto,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  const userId = req.user._id;

  const result = await getContactsPaginated({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: result.items,
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      hasPreviousPage: result.hasPreviousPage,
      hasNextPage: result.hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById({
    contactId: req.params.contactId,
    userId: req.user._id,
  });

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
  const contact = await createContact({
    payload: req.body,
    userId: req.user._id,
    file: req.file,
  });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  await deleteContact({
    contactId: req.params.contactId,
    userId: req.user._id,
  });
  res.status(204).end();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.user._id, req.body, {
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
  const { body, file } = req;

  if (!file && Object.keys(body).length === 0) {
    throw createHttpError(400, 'Body is empty');
  }

  const result = await updateContact(contactId, req.user._id, body, file);

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

export const uploadContactsPhotoController = async (req, res) => {
  console.log('DEBUG req.file:', req.file);
  const contact = await uploadContactsPhoto(
    req.params.contactId,
    req.file,
    req.user._id,
  );
  res.send({
    status: 200,
    message: 'Successfully uploaded a photo for a contact!',
    data: contact,
  });
};
