'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const subjectSchema = Joi.string().valid(
  'frontend',
  'backend',
  'fullstack',
  'dsa',
  'dbms',
  'os',
  'cn',
  'aptitude',
  'hr',
  'system-design'
);

const topicSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  confidence: Joi.number().integer().min(1).max(5).default(3),
  notes: Joi.string().allow('').max(1000),
  lastRevisedAt: Joi.date(),
});

const upsertPrepSchema = Joi.object({
  subject: subjectSchema.required(),
  topics: Joi.array().items(topicSchema).default([]),
});

const addTopicSchema = topicSchema;

const updateTopicSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  confidence: Joi.number().integer().min(1).max(5),
  notes: Joi.string().allow('').max(1000),
  lastRevisedAt: Joi.date(),
}).min(1);

const subjectParamSchema = Joi.object({
  subject: subjectSchema.required(),
});

const topicParamSchema = Joi.object({
  subject: subjectSchema.required(),
  topicId: objectId.required(),
});

module.exports = {
  upsertPrepSchema,
  addTopicSchema,
  updateTopicSchema,
  subjectParamSchema,
  topicParamSchema,
};