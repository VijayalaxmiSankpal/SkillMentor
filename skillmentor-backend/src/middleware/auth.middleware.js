'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt.util');
const User = require('../models/user.model');

/**
 * Protect routes — verify access token from cookie or Authorization header.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  let token;

  // 1. Try cookie first (preferred)
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Fallback to Authorization header (Bearer)
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Access token missing');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Access token expired');
    }
    throw ApiError.unauthorized('Invalid access token');
  }

  // Optionally fetch fresh user (ensures user still exists & not deleted)
  const user = await User.findById(decoded.sub);
  if (!user || user.isDeleted) {
    throw ApiError.unauthorized('User no longer exists');
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };

  next();
});

/**
 * Restrict access to specific roles.
 * Usage: authorize('admin')
 */
const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };