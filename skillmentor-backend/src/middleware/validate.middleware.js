'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Generic Joi validation middleware.
 * Usage: validate(schema, 'body' | 'params' | 'query')
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    req[source] = value;
    next();
  };
};

module.exports = validate;