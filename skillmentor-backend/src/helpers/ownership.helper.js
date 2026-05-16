'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Ensure a document belongs to the requesting user.
 * Throws 403 if mismatch, 404 if not found.
 */
const ensureOwner = (doc, userId, resourceName = 'Resource') => {
  if (!doc) {
    throw ApiError.notFound(`${resourceName} not found`);
  }
  if (doc.user.toString() !== userId.toString()) {
    throw ApiError.forbidden(`You do not have access to this ${resourceName.toLowerCase()}`);
  }
  return doc;
};

module.exports = { ensureOwner };