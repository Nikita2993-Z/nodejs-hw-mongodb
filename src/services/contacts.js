import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { saveFile } from '../utils/saveFile.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToLocal } from '../utils/saveFileToLocal.js';

export const getContactsPaginated = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
} = {}) => {
  page = Number(page) || 1;
  perPage = Number(perPage) || 10;

  if (!userId) throw createHttpError(500, 'UserID is required');

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 1;
  if (perPage > 100) perPage = 100;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  const collation = { locale: 'uk', strength: 1 };

  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite =
      typeof isFavourite === 'boolean'
        ? isFavourite
        : String(isFavourite).toLowerCase() === 'true';
  }
  const countPromise = Contact.countDocuments(filter);
  const itemsPromise = Contact.find(filter)
    .collation(collation)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  return Promise.all([countPromise, itemsPromise]).then(
    ([totalItems, items]) => {
      const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
      const hasPreviousPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        items,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      };
    },
  );
};

export const getContacts = async (userId) => {
  const contacts = await Contact.find({ userId });
  return contacts;
};

export const getContactById = async ({ contactId, userId }) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async ({ payload, userId, file }) => {
  if (!userId) throw createHttpError(500, 'userId is required');

  let photoUrl = null;

  if (file) {
    const strategy = getEnvVar(ENV_VARS.FILE_STORAGE_STRATEGY);

    if (strategy === 'cloudinary') {
      photoUrl = await saveFileToCloudinary(file);
    } else {
      photoUrl = await saveFileToLocal(file);
    }
  }

  const contact = await Contact.create({ ...payload, userId, photo: photoUrl });
  return contact;
};

export const deleteContact = async ({ contactId, userId }) => {
  const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deleted) throw createHttpError(404, 'Contact not found');
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  file,
  options = {},
) => {
  if (!file && (!payload || Object.keys(payload).length === 0)) {
    throw createHttpError(400, 'Body is empty');
  }

  let updates = { ...payload };

  if (file) {
    const strategy = getEnvVar(ENV_VARS.FILE_STORAGE_STRATEGY);
    const photoUrl =
      strategy === 'cloudinary'
        ? await saveFileToCloudinary(file)
        : await saveFileToLocal(file);

    updates.photo = photoUrl;
  }

  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updates,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const uploadContactsPhoto = async (contactId, file, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found!');

  const strategy = getEnvVar(ENV_VARS.FILE_STORAGE_STRATEGY);
  const filePath =
    strategy === 'cloudinary'
      ? await saveFileToCloudinary(file)
      : await saveFileToLocal(file);

  contact.photo = filePath;
  await contact.save();

  return contact;
};
