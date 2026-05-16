'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const { STATUS_CODES, MESSAGES } = require('../constants');
const env = require('../config/env.config');

/* ----------------------------------------------------------
 * Cookie helpers
 * ---------------------------------------------------------- */
const accessCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 min
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth', // Refresh cookie only sent to auth routes
};

const clearCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
};

/* ----------------------------------------------------------
 * Controllers
 * ---------------------------------------------------------- */

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signup(req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { user }, MESSAGES.AUTH.SIGNUP_SUCCESS).send(res);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);
  return new ApiResponse(STATUS_CODES.OK, { user }, MESSAGES.AUTH.EMAIL_VERIFIED).send(res);
});

const resendVerification = asyncHandler(async (req, res) => {
  await authService.resendVerification(req.body.email);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.AUTH.VERIFICATION_SENT).send(res);
});

const login = asyncHandler(async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const { user, accessToken, refreshToken } = await authService.login({
    ...req.body,
    userAgent,
  });

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  return new ApiResponse(STATUS_CODES.OK, { user, accessToken }, MESSAGES.AUTH.LOGIN_SUCCESS).send(res);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout({
    userId: req.user.id,
    refreshToken: req.cookies?.refreshToken,
  });

  res.clearCookie('accessToken', clearCookieOptions);
  res.clearCookie('refreshToken', { ...clearCookieOptions, path: '/api/v1/auth' });

  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.AUTH.LOGOUT_SUCCESS).send(res);
});

const refreshToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken;
  const userAgent = req.headers['user-agent'] || '';

  const { accessToken, refreshToken: newRefresh, user } = await authService.refreshTokens({
    refreshToken: incoming,
    userAgent,
  });

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', newRefresh, refreshCookieOptions);

  return new ApiResponse(STATUS_CODES.OK, { user, accessToken }, 'Token refreshed').send(res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.AUTH.PASSWORD_RESET_SENT).send(res);
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword({
    token: req.params.token,
    newPassword: req.body.password,
  });
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.AUTH.PASSWORD_RESET_SUCCESS).send(res);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, { user }, MESSAGES.GENERIC.FETCHED).send(res);
});

module.exports = {
  signup,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
};