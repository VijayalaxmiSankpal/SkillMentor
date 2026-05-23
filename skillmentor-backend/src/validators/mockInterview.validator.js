'use strict';

const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID');

const questionSchema = Joi.object({
  question: Joi.string().min(1).max(1000).required(),
  answer: Joi.string().allow('').max(5000),
  score: Joi.number().min(0).max(10).default(0),
  feedback: Joi.string().allow('').max(2000),
});

const createSchema = Joi.object({
  role: Joi.string().trim().min(2).max(80).required(),
  type: Joi.string().valid('technical', 'hr', 'system-design', 'behavioral', 'mixed').required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  durationMinutes: Joi.number().integer().min(5).max(240).default(30),
  scheduledAt: Joi.date(),
  questions: Joi.array().items(questionSchema).default([]),
  status: Joi.string().valid('scheduled', 'in-progress', 'completed', 'cancelled').default('scheduled'),
});

const updateSchema = Joi.object({
  role: Joi.string().trim().min(2).max(80),
  type: Joi.string().valid('technical', 'hr', 'system-design', 'behavioral', 'mixed'),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  durationMinutes: Joi.number().integer().min(5).max(240),
  scheduledAt: Joi.date(),
  questions: Joi.array().items(questionSchema),
  status: Joi.string().valid('scheduled', 'in-progress', 'completed', 'cancelled'),
}).min(1);

const feedbackSchema = Joi.object({
  overallScore: Joi.number().min(0).max(10),
  overallFeedback: Joi.string().allow('').max(5000),
  strengths: Joi.array().items(Joi.string().trim()),
  weaknesses: Joi.array().items(Joi.string().trim()),
}).min(1);

const idParamSchema = Joi.object({ id: objectId.required() });
const answerSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(1).max(1000).required(),
        answer: Joi.string().allow("").max(5000).required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  createSchema,
  updateSchema,
  feedbackSchema,
  answerSchema,
  idParamSchema,
};