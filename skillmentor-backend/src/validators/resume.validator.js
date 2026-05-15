'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const uploadResumeSchema = Joi.object({
  targetRole: Joi.string().trim().allow('').max(80),
});

const idParamSchema = Joi.object({ id: objectId.required() });

module.exports = { uploadResumeSchema, idParamSchema };