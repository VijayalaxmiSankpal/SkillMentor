'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const milestoneInputSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().allow('').max(1000),
  resources: Joi.array().items(Joi.string().uri()).default([]),
  order: Joi.number().integer().min(0).default(0),
  isCompleted: Joi.boolean().default(false),
});

const createRoadmapSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  targetRole: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().allow('').max(1000),
  skills: Joi.array().items(objectId).default([]),
  milestones: Joi.array().items(milestoneInputSchema).default([]),
});

const updateRoadmapSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  targetRole: Joi.string().trim().min(2).max(80),
  description: Joi.string().allow('').max(1000),
  skills: Joi.array().items(objectId),
  status: Joi.string().valid('active', 'completed', 'archived'),
}).min(1);

const updateMilestoneSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  description: Joi.string().allow('').max(1000),
  resources: Joi.array().items(Joi.string().uri()),
  isCompleted: Joi.boolean(),
  order: Joi.number().integer().min(0),
}).min(1);

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const milestoneParamsSchema = Joi.object({
  id: objectId.required(),
  milestoneId: objectId.required(),
});

module.exports = {
  createRoadmapSchema,
  updateRoadmapSchema,
  updateMilestoneSchema,
  idParamSchema,
  milestoneParamsSchema,
};