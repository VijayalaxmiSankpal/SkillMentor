'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const createNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150).required(),
  content: Joi.string().min(1).max(50000).required(),
  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
  category: Joi.string().valid('dsa', 'dbms', 'os', 'cn', 'system-design', 'frontend', 'backend', 'aptitude', 'hr', 'other').default('other'),
  isPinned: Joi.boolean().default(false),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150),
  content: Joi.string().min(1).max(50000),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  category: Joi.string().valid('dsa', 'dbms', 'os', 'cn', 'system-design', 'frontend', 'backend', 'aptitude', 'hr', 'other'),
  isPinned: Joi.boolean(),
}).min(1);

const idParamSchema = Joi.object({ id: objectId.required() });

module.exports = { createNoteSchema, updateNoteSchema, idParamSchema };