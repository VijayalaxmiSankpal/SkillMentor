'use strict';

const crypto = require('crypto');

/**
 * Generate a random URL-safe token (hex).
 * Used for email verification & password reset.
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token using SHA-256 (deterministic, fast).
 * We store hashed tokens in DB; the original is sent via email.
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = { generateRandomToken, hashToken };