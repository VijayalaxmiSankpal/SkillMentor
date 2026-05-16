'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const createSchema = Joi.object({
  questionTitle: Joi.string().trim().min(1).max(200).required(),
  platform: Joi.string().valid('leetcode', 'codeforces', 'codechef', 'gfg', 'hackerrank', 'atcoder', 'other').default('leetcode'),
  questionUrl: Joi.string().uri().allow(''),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  topic: Joi.string().trim().lowercase().min(1).max(50).required(),
  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
  status: Joi.string().valid('solved', 'attempted', 'revisit').default('solved'),
  timeSpentMinutes: Joi.number().min(0).default(0),
  notes: Joi.string().allow('').max(2000),
  solvedAt: Joi.date().default(() => new Date()),
});

const updateSchema = Joi.object({
  questionTitle: Joi.string().trim().min(1).max(200),
  platform: Joi.string().valid('leetcode', 'codeforces', 'codechef', 'gfg', 'hackerrank', 'atcoder', 'other'),
  questionUrl: Joi.string().uri().allow(''),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  topic: Joi.string().trim().lowercase().min(1).max(50),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  status: Joi.string().valid('solved', 'attempted', 'revisit'),
  timeSpentMinutes: Joi.number().min(0),
  notes: Joi.string().allow('').max(2000),
  solvedAt: Joi.date(),
}).min(1);

const idParamSchema = Joi.object({ id: objectId.required() });

module.exports = { createSchema, updateSchema, idParamSchema };