'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await userService.getDashboard(req.user.id);

  return new ApiResponse(
    STATUS_CODES.OK,
    dashboardData,
    'Dashboard data fetched successfully'
  ).send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);

  return new ApiResponse(
    STATUS_CODES.OK,
    { user },
    MESSAGES.GENERIC.UPDATED
  ).send(res);
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', {
    path: '/api/v1/auth',
  });

  return new ApiResponse(
    STATUS_CODES.OK,
    null,
    'Password changed. Please login again.'
  ).send(res);
});

const deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user.id);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', {
    path: '/api/v1/auth',
  });

  return new ApiResponse(
    STATUS_CODES.OK,
    null,
    'Account deleted'
  ).send(res);
});

module.exports = {
  getDashboard,
  updateProfile,
  changePassword,
  deleteAccount,
};