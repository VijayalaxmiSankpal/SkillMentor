'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Note = require('../models/note.model');
const CodingLog = require('../models/codingLog.model');
const MockInterview = require('../models/mockInterview.model');
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

const getDashboard = async (userId) => {
  const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

  const [
    problemsSolved,
    notesCreated,
    mockInterviews,
    difficultyCounts,
    recentCodingLogs,
    weeklyActivity,
  ] = await Promise.all([
    CodingLog.countDocuments({
      user: objectUserId,
      status: 'solved',
      isDeleted: false,
    }),

    Note.countDocuments({
      user: objectUserId,
      isDeleted: false,
    }),

    MockInterview.countDocuments({
      user: objectUserId,
      isDeleted: false,
    }),

    CodingLog.aggregate([
      {
        $match: {
          user: objectUserId,
          status: 'solved',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
        },
      },
    ]),

    CodingLog.find({
      user: objectUserId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('questionTitle platform difficulty topic createdAt'),

    CodingLog.aggregate([
      {
        $match: {
          user: objectUserId,
          status: 'solved',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: '$createdAt',
          },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const difficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  difficultyCounts.forEach((item) => {
    difficulty[item._id] = item.count;
  });

  const weeklyMap = {
    1: 'Sun',
    2: 'Mon',
    3: 'Tue',
    4: 'Wed',
    5: 'Thu',
    6: 'Fri',
    7: 'Sat',
  };

  const weeklyData = [
    { day: 'Mon', solved: 0 },
    { day: 'Tue', solved: 0 },
    { day: 'Wed', solved: 0 },
    { day: 'Thu', solved: 0 },
    { day: 'Fri', solved: 0 },
    { day: 'Sat', solved: 0 },
    { day: 'Sun', solved: 0 },
  ];

  weeklyActivity.forEach((item) => {
    const dayName = weeklyMap[item._id];

    const existing = weeklyData.find((d) => d.day === dayName);

    if (existing) {
      existing.solved = item.count;
    }
  });

  return {
    stats: {
      problemsSolved,
      notesCreated,
      roadmapProgress: problemsSolved > 0 ? Math.min(problemsSolved * 5, 100) : 0,
      mockInterviews,
      streak: problemsSolved,
      achievements: problemsSolved >= 5 ? 1 : 0,
    },

    difficulty,

    weeklyActivity: weeklyData,

    recentActivity: recentCodingLogs.map((log) => ({
      id: log._id,
      title: log.questionTitle,
      platform: log.platform,
      difficulty: log.difficulty,
      topic: log.topic,
      date: log.createdAt,
    })),
  };
};

const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw ApiError.notFound('User not found');
  }

  Object.assign(user, payload);
  await user.save();

  return sanitizeUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password +refreshTokens');

  if (!user || user.isDeleted) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await comparePassword(currentPassword, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    throw ApiError.badRequest(
      'New password must be different from current password'
    );
  }

  user.password = await hashPassword(newPassword);
  user.refreshTokens = [];

  await user.save();
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw ApiError.notFound('User not found');
  }

  user.isDeleted = true;
  user.refreshTokens = [];

  await user.save();
};

module.exports = {
  getDashboard,
  updateProfile,
  changePassword,
  deleteAccount,
};