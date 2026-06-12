'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Note = require('../models/note.model');
const CodingLog = require('../models/codingLog.model');
const MockInterview = require('../models/mockInterview.model');
const Roadmap = require('../models/roadmap.model');
const ResumeReview = require('../models/resumeReview.model');
const InterviewPrep = require('../models/interviewPrep.model');
const Course = require('../models/course.model');
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

const calculateStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;

  const solvedDates = [
    ...new Set(
      logs.map((log) =>
        new Date(log.solvedAt || log.createdAt).toISOString().split('T')[0]
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < solvedDates.length; i += 1) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    const expected = expectedDate.toISOString().split('T')[0];

    if (solvedDates[i] === expected) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const getDashboard = async (userId) => {
  const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

  const [
    solvedLogs,
    problemsSolved,
    notesCreated,
    mockInterviews,
    completedMockInterviews,
    resumeReviews,
    roadmapDocs,
    difficultyCounts,
    platformCounts,
    topicCounts,
    recentCodingLogs,
    weeklyActivity,
interviewPreps,
courseDocs,
] = await Promise.all([
    CodingLog.find({
      user: objectUserId,
      status: 'solved',
      isDeleted: false,
    }).select('createdAt solvedAt'),

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

    MockInterview.countDocuments({
      user: objectUserId,
      status: 'completed',
      isDeleted: false,
    }),

    ResumeReview.countDocuments({
      user: objectUserId,
      status: 'completed',
      isDeleted: false,
    }),

    Roadmap.find({
      user: objectUserId,
      isDeleted: false,
    }).select('milestones'),

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

    CodingLog.aggregate([
      {
        $match: {
          user: objectUserId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
        },
      },
    ]),

    CodingLog.aggregate([
      {
        $match: {
          user: objectUserId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),

    CodingLog.find({
      user: objectUserId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('questionTitle platform difficulty topic createdAt solvedAt'),

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
          solved: { $sum: 1 },
        },
      },
    ]),
    InterviewPrep.find({
  user: objectUserId,
  isDeleted: false,
}).select('subject topics overallProgress'),

Course.find({
  user: objectUserId,
  isDeleted: false,
}).select('title topic progress lessons isCompleted'),
  ]);

  const difficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  difficultyCounts.forEach((item) => {
    difficulty[item._id] = item.count;
  });

  const byPlatform = {};
  platformCounts.forEach((item) => {
    byPlatform[item._id || 'other'] = item.count;
  });

  const topTopics = topicCounts.map((item) => ({
    topic: item._id || 'other',
    count: item.count,
  }));

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
      existing.solved = item.solved;
    }
  });

  const roadmapTotals = roadmapDocs.reduce(
    (acc, roadmap) => {
      const milestones = roadmap.milestones || [];
      acc.total += milestones.length;
      acc.completed += milestones.filter((m) => m.isCompleted).length;
      return acc;
    },
    { total: 0, completed: 0 }
  );

  const roadmapProgress =
    roadmapTotals.total > 0
      ? Math.round((roadmapTotals.completed / roadmapTotals.total) * 100)
      : 0;

  const streak = calculateStreak(solvedLogs);

  let achievements = 0;
  if (problemsSolved >= 5) achievements += 1;
  if (problemsSolved >= 10) achievements += 1;
  if (notesCreated >= 5) achievements += 1;
  if (completedMockInterviews >= 1) achievements += 1;
  if (resumeReviews >= 1) achievements += 1;
  if (roadmapProgress >= 50) achievements += 1;

const roadmapBarsMap = {};

roadmapDocs.forEach((roadmap) => {
  (roadmap.milestones || []).forEach((milestone) => {
    const rawTitle = milestone.title || 'General';
    const label = rawTitle.split(' ')[0];

    if (!roadmapBarsMap[label]) {
      roadmapBarsMap[label] = {
        label,
        value: 0,
        max: 0,
        color: 'brand',
      };
    }

    roadmapBarsMap[label].max += 1;

    if (milestone.isCompleted) {
      roadmapBarsMap[label].value += 1;
    }
  });
});

const roadmapBars = Object.values(roadmapBarsMap).slice(0, 5);

const subjectLabelMap = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  dsa: 'DSA',
  dbms: 'DBMS',
  os: 'OS',
  cn: 'Networking',
  aptitude: 'Aptitude',
  hr: 'HR Topics',
  'system-design': 'System Design',
};

const interviewReadiness = interviewPreps.map((prep) => {
  const topics = prep.topics || [];

  const total = topics.length;

  const completed = topics.filter((topic) => {
    return topic.confidence >= 4;
  }).length;

  return {
    label: subjectLabelMap[prep.subject] || prep.subject,
    value: completed,
    max: total || 1,
    color: 'brand',
  };
});

const courseProgress = courseDocs.slice(0, 5).map((course) => ({
  label: course.title,
  value: course.progress || 0,
  max: 100,
  color: 'accent',
}));

  return {
    stats: {
      problemsSolved,
      notesCreated,
      roadmapProgress,
      mockInterviews,
      completedMockInterviews,
      resumeReviews,
      streak,
      achievements,
    },

    difficulty,
    byPlatform,
    topTopics,
    weeklyActivity: weeklyData,
    roadmapBars,
interviewReadiness,
courseProgress,

    recentActivity: recentCodingLogs.map((log) => ({
  id: log._id,
  type: 'coding',
  title: `Solved ${log.questionTitle}`,
  subtitle: `${log.platform} — ${log.difficulty}`,
  topic: log.topic,
  date: log.solvedAt || log.createdAt,
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