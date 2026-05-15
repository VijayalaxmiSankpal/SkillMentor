'use strict';

const Groq = require('groq-sdk');
const env = require('./env.config');
const logger = require('../utils/logger');

const groq = new Groq({
  apiKey: env.ai.groqApiKey,
});

logger.info(`🤖 Groq AI initialized with model: ${env.ai.groqModel}`);

module.exports = { groq };