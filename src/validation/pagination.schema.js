import Joi from 'joi';

export const contactsListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  type: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
});
