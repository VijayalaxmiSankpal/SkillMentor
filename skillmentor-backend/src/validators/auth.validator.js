'use strict';

const Joi = require('joi');

const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[0-9]/, 'digit')
  .required()
  .messages({
    'string.pattern.name': 'Password must contain at least one {#name} character',
    'string.min': 'Password must be at least 8 characters',
  });

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: passwordRule,
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const emailOnlySchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  password: passwordRule,
});

const tokenParamSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  emailOnlySchema,
  resetPasswordSchema,
  tokenParamSchema,
};