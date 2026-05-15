'use strict';

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/bcrypt.util');

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throw ApiError.notFound('User not found');
  Object.assign(user, payload);
  await user.save();
  return sanitizeUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password +refreshTokens');
  if (!user || user.isDeleted) throw ApiError.notFound('User not found');

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

  if (currentPassword === newPassword) {
    throw ApiError.badRequest('New password must be different from current password');
  }

  user.password = await hashPassword(newPassword);
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throw ApiError.notFound('User not found');
  user.isDeleted = true;
  user.refreshTokens = [];
  await user.save();
};

module.exports = { updateProfile, changePassword, deleteAccount };