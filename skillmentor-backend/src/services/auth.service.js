'use strict';
const ms = require('ms');

// const ms = require('ms') || ((str) => {
//   // Tiny fallback if `ms` not installed; converts "15m"/"7d" to milliseconds
//   const m = /^(\d+)([smhd])$/.exec(str);
//   if (!m) return 0;
//   const n = parseInt(m[1], 10);
//   return { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[m[2]] * n;
// });

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/bcrypt.util');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const { generateRandomToken, hashToken } = require('../utils/crypto.util');
const env = require('../config/env.config');
const { MESSAGES } = require('../constants');
const emailService = require('./email.service');

/* ----------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------- */
const buildTokens = (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

/* ----------------------------------------------------------
 * Signup
 * ---------------------------------------------------------- */
const signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict(MESSAGES.AUTH.EMAIL_EXISTS);
  }

  const hashed = await hashPassword(password);

  // Generate verify token
  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const user = await User.create({
    name,
    email,
    password: hashed,
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: expiresAt,
  });

  // Fire email (don't block signup if email fails — log it)
  const verifyUrl = `http://localhost:5000/api/v1/auth/verify-email/${rawToken}`;
  emailService
    .sendVerificationEmail({ to: email, name, verifyUrl })
    .catch(() => { /* logged inside service */ });

  return sanitizeUser(user);
};

/* ----------------------------------------------------------
 * Verify Email
 * ---------------------------------------------------------- */
const verifyEmail = async (token) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: { $gt: new Date() },
  }).select('+emailVerificationTokenHash +emailVerificationExpiresAt');

  if (!user) {
    throw ApiError.badRequest(MESSAGES.AUTH.INVALID_TOKEN);
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();

  emailService
    .sendWelcomeEmail({ to: user.email, name: user.name })
    .catch(() => {});

  return sanitizeUser(user);
};

/* ----------------------------------------------------------
 * Resend Verification
 * ---------------------------------------------------------- */
const resendVerification = async (email) => {
  const user = await User.findOne({ email }).select(
    '+emailVerificationTokenHash +emailVerificationExpiresAt'
  );
  if (!user) {
    // Don't reveal whether email exists
    return;
  }
  if (user.isEmailVerified) {
    throw ApiError.badRequest('Email is already verified');
  }

  const rawToken = generateRandomToken(32);
  user.emailVerificationTokenHash = hashToken(rawToken);
  user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `http://localhost:5000/api/v1/auth/verify-email/${rawToken}`;
  await emailService.sendVerificationEmail({
    to: user.email,
    name: user.name,
    verifyUrl,
  });
};

/* ----------------------------------------------------------
 * Login
 * ---------------------------------------------------------- */
const login = async ({ email, password, userAgent = '' }) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    '+password +refreshTokens'
  );

  if (!user) {
    throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  // if (!user.isEmailVerified) {
  //   throw ApiError.forbidden(MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
  // }

  const { accessToken, refreshToken } = buildTokens(user);

  // Store hashed refresh token (multi-device)
  const refreshExpiryMs = ms(env.jwt.refreshExpiry);
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + refreshExpiryMs),
    userAgent,
  });

  // Keep only last 5 sessions
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

/* ----------------------------------------------------------
 * Logout
 * ---------------------------------------------------------- */
const logout = async ({ userId, refreshToken }) => {
  if (!refreshToken) return;

  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  const incomingHash = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
  await user.save();
};

/* ----------------------------------------------------------
 * Refresh Tokens (rotation)
 * ---------------------------------------------------------- */
const refreshTokens = async ({ refreshToken, userAgent = '' }) => {
  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token missing');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokens');
  if (!user || user.isDeleted) {
    throw ApiError.unauthorized('User not found');
  }

  const incomingHash = hashToken(refreshToken);
  const existing = user.refreshTokens.find((t) => t.tokenHash === incomingHash);

  if (!existing) {
    // Possible token reuse → revoke all for safety
    user.refreshTokens = [];
    await user.save();
    throw ApiError.unauthorized('Refresh token revoked');
  }

  // Rotate: remove old, issue new
  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);

  const { accessToken, refreshToken: newRefresh } = buildTokens(user);
  const refreshExpiryMs = ms(env.jwt.refreshExpiry);

  user.refreshTokens.push({
    tokenHash: hashToken(newRefresh),
    expiresAt: new Date(Date.now() + refreshExpiryMs),
    userAgent,
  });
  await user.save();

  return { accessToken, refreshToken: newRefresh, user: sanitizeUser(user) };
};

/* ----------------------------------------------------------
 * Forgot Password
 * ---------------------------------------------------------- */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    '+passwordResetTokenHash +passwordResetExpiresAt'
  );

  // Always succeed silently to prevent email enumeration
  if (!user) return;

  const rawToken = generateRandomToken(32);
  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const resetUrl = `${env.cors.clientUrl}/reset-password/${rawToken}`;
  await emailService.sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    resetUrl,
  });
};

/* ----------------------------------------------------------
 * Reset Password
 * ---------------------------------------------------------- */
const resetPassword = async ({ token, newPassword }) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpiresAt +refreshTokens');

  if (!user) {
    throw ApiError.badRequest(MESSAGES.AUTH.INVALID_TOKEN);
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshTokens = []; // Force re-login on all devices
  await user.save();
};

/* ----------------------------------------------------------
 * Get Current User
 * ---------------------------------------------------------- */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw ApiError.notFound('User not found');
  }
  return sanitizeUser(user);
};

module.exports = {
  signup,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  getMe,
};