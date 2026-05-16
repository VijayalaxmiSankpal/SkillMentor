'use strict';

/**
 * Wraps async route handlers and forwards errors to the global error middleware.
 * Eliminates repetitive try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;