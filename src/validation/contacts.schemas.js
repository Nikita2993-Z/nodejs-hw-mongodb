import Joi from 'joi';

const shortStr = Joi.string().min(3).max(20).trim();

export const createContactSchema = Joi.object({
  name: shortStr.required().messages({
    'any.required': 'name is required',
  }),
  phoneNumber: shortStr.required().messages({
    'any.required': 'phoneNumber is required',
  }),
  email: shortStr
    .email({ tlds: { allow: false } })
    .min(3)
    .max(20),
  isFavourite: Joi.boolean(),
  contactType: shortStr.valid('work', 'home', 'personal').required().messages({
    'any.only': 'contactType must be one of: work, home, personal',
    'any.required': 'contactType is required',
  }),
});

export const updateContactSchema = Joi.object({
  name: shortStr,
  phoneNumber: shortStr,
  email: shortStr
    .email({ tlds: { allow: false } })
    .min(3)
    .max(20),
  isFavourite: Joi.boolean(),
  contactType: shortStr.valid('work', 'home', 'personal'),
})
  .min(1)
  .messages({
    'object.min': 'Body must contain at least one updatable field',
  });
