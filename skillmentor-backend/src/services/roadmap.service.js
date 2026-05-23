'use strict';

const Roadmap = require('../models/roadmap.model');
const ApiError = require('../utils/ApiError');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');

const create = async (userId, payload) => {
  return Roadmap.create({ ...payload, user: userId });
};

const list = async (userId) => {
  const roadmaps = await Roadmap.find({
    user: userId,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return {
    items: roadmaps,
  };
};

const getById = async (userId, id) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false }).populate('skills', 'name category');
  ensureOwner(roadmap, userId, 'Roadmap');
  return roadmap;
};

const update = async (userId, id, payload) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false });
  ensureOwner(roadmap, userId, 'Roadmap');

  Object.assign(roadmap, payload);
  await roadmap.save();
  return roadmap;
};

const remove = async (userId, id) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false });
  ensureOwner(roadmap, userId, 'Roadmap');
  roadmap.isDeleted = true;
  await roadmap.save();
};

const addMilestone = async (userId, id, payload) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false });
  ensureOwner(roadmap, userId, 'Roadmap');
  roadmap.milestones.push(payload);
  await roadmap.save();
  return roadmap;
};

const updateMilestone = async (userId, id, milestoneId, payload) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false });
  ensureOwner(roadmap, userId, 'Roadmap');

  const milestone = roadmap.milestones.id(milestoneId);
  if (!milestone) throw ApiError.notFound('Milestone not found');

  Object.assign(milestone, payload);
  if (payload.isCompleted === true && !milestone.completedAt) {
    milestone.completedAt = new Date();
  }
  if (payload.isCompleted === false) {
    milestone.completedAt = undefined;
  }

  await roadmap.save();
  return roadmap;
};

const deleteMilestone = async (userId, id, milestoneId) => {
  const roadmap = await Roadmap.findOne({ _id: id, isDeleted: false });
  ensureOwner(roadmap, userId, 'Roadmap');

  const milestone = roadmap.milestones.id(milestoneId);
  if (!milestone) throw ApiError.notFound('Milestone not found');

  milestone.deleteOne();
  await roadmap.save();
  return roadmap;
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  addMilestone,
  updateMilestone,
  deleteMilestone,
};