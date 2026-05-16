'use strict';

const gemini = require('./providers/gemini.provider');

/**
 * Unified AI client — easy swap between providers later.
 */
module.exports = {
  generateText: gemini.generateText,
  generateChat: gemini.generateChat,
  generateJSON: gemini.generateJSON,
};