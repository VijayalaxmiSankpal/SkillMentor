'use strict';

const Joi = require('joi');

const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[0-9]/, 'digit')
  .messages({
    'string.pattern.name': 'Password must contain at least one {#name} character',
  });

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60),
  avatar: Joi.string().uri().allow(''),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordRule.required(),
});

module.exports = { updateProfileSchema, changePasswordSchema };