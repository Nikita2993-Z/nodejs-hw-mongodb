export const validateQuery = (schema) => async (req, res, next) => {
  const validationResult = await schema.validate(req.query, {
    allowUnknown: false,
    abortEarly: false,
    convert: true,
  });
  req.validatedQuery = validationResult;
  next();
};
