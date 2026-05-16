'use strict';

const CodingLog = require('../models/codingLog.model');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');

const create = async (userId, payload) => {
  return CodingLog.create({ ...payload, user: userId });
};

const list = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, isDeleted: false };

  if (query.platform) filter.platform = query.platform;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.topic) filter.topic = query.topic.toLowerCase();
  if (query.status) filter.status = query.status;

  if (query.from || query.to) {
    filter.solvedAt = {};
    if (query.from) filter.solvedAt.$gte = new Date(query.from);
    if (query.to) filter.solvedAt.$lte = new Date(query.to);
  }

  if (query.search) {
    filter.questionTitle = { $regex: query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    CodingLog.find(filter).sort({ solvedAt: -1 }).skip(skip).limit(limit),
    CodingLog.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ total, page, limit }) };
};

const getById = async (userId, id) => {
  const log = await CodingLog.findOne({ _id: id, isDeleted: false });
  ensureOwner(log, userId, 'CodingLog');
  return log;
};

const update = async (userId, id, payload) => {
  const log = await CodingLog.findOne({ _id: id, isDeleted: false });
  ensureOwner(log, userId, 'CodingLog');
  Object.assign(log, payload);
  await log.save();
  return log;
};

const remove = async (userId, id) => {
  const log = await CodingLog.findOne({ _id: id, isDeleted: false });
  ensureOwner(log, userId, 'CodingLog');
  log.isDeleted = true;
  await log.save();
};

/**
 * Aggregated stats: by difficulty, by topic, by platform, total time.
 */
const getStats = async (userId) => {
  const baseMatch = { user: require('mongoose').Types.ObjectId.createFromHexString(userId), isDeleted: false };

  const [byDifficulty, byPlatform, byTopic, totals] = await Promise.all([
    CodingLog.aggregate([
      { $match: baseMatch },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]),
    CodingLog.aggregate([
      { $match: baseMatch },
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]),
    CodingLog.aggregate([
      { $match: baseMatch },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
    CodingLog.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalSolved: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } },
          totalAttempted: { $sum: 1 },
          totalTimeMinutes: { $sum: '$timeSpentMinutes' },
        },
      },
    ]),
  ]);

  return {
    byDifficulty: byDifficulty.reduce((acc, d) => ({ ...acc, [d._id]: d.count }), {}),
    byPlatform: byPlatform.reduce((acc, p) => ({ ...acc, [p._id]: p.count }), {}),
    topTopics: byTopic.map((t) => ({ topic: t._id, count: t.count })),
    totals: totals[0] || { totalSolved: 0, totalAttempted: 0, totalTimeMinutes: 0 },
  };
};

module.exports = { create, list, getById, update, remove, getStats };