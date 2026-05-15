'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const mentorChatSchema = Joi.object({
  chatId: objectId.optional(),
  message: Joi.string().trim().min(1).max(4000).required(),
});

const interviewQuestionsSchema = Joi.object({
  role: Joi.string().trim().min(2).max(80).required(),
  type: Joi.string().valid('technical', 'hr', 'system-design', 'behavioral', 'mixed').required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  skills: Joi.array().items(Joi.string().trim()).default([]),
  count: Joi.number().integer().min(1).max(20).default(10),
});

const studyPlanSchema = Joi.object({
  targetRole: Joi.string().trim().min(2).max(80).required(),
  durationWeeks: Joi.number().integer().min(1).max(52).default(8),
  hoursPerDay: Joi.number().min(1).max(16).default(3),
  currentLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  focusAreas: Joi.array().items(Joi.string().trim()).default([]),
});

const idParamSchema = Joi.object({ id: objectId.required() });

module.exports = {
  mentorChatSchema,
  interviewQuestionsSchema,
  studyPlanSchema,
  idParamSchema,
};