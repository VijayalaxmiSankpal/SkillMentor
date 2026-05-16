'use strict';

const MockInterview = require('../models/mockInterview.model');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');

const create = async (userId, payload) => {
  return MockInterview.create({ ...payload, user: userId });
};

const list = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, isDeleted: false };

  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  if (query.role) filter.role = { $regex: query.role, $options: 'i' };

  const [items, total] = await Promise.all([
    MockInterview.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MockInterview.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ total, page, limit }) };
};

const getById = async (userId, id) => {
  const interview = await MockInterview.findOne({ _id: id, isDeleted: false });
  ensureOwner(interview, userId, 'MockInterview');
  return interview;
};

const update = async (userId, id, payload) => {
  const interview = await MockInterview.findOne({ _id: id, isDeleted: false });
  ensureOwner(interview, userId, 'MockInterview');
  Object.assign(interview, payload);
  if (payload.status === 'completed' && !interview.completedAt) {
    interview.completedAt = new Date();
  }
  await interview.save();
  return interview;
};

const remove = async (userId, id) => {
  const interview = await MockInterview.findOne({ _id: id, isDeleted: false });
  ensureOwner(interview, userId, 'MockInterview');
  interview.isDeleted = true;
  await interview.save();
};

const saveFeedback = async (userId, id, payload) => {
  const interview = await MockInterview.findOne({ _id: id, isDeleted: false });
  ensureOwner(interview, userId, 'MockInterview');

  if (payload.overallScore !== undefined) interview.overallScore = payload.overallScore;
  if (payload.overallFeedback !== undefined) interview.overallFeedback = payload.overallFeedback;
  if (payload.strengths) interview.strengths = payload.strengths;
  if (payload.weaknesses) interview.weaknesses = payload.weaknesses;

  await interview.save();
  return interview;
};

module.exports = { create, list, getById, update, remove, saveFeedback };