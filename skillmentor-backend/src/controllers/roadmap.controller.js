'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const roadmapService = require('../services/roadmap.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const create = asyncHandler(async (req, res) => {
  const data = await roadmapService.create(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { roadmap: data }, MESSAGES.ROADMAP.CREATED).send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await roadmapService.list(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.ROADMAP.FETCHED).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const data = await roadmapService.getById(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { roadmap: data }, MESSAGES.ROADMAP.FETCHED).send(res);
});

const update = asyncHandler(async (req, res) => {
  const data = await roadmapService.update(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { roadmap: data }, MESSAGES.ROADMAP.UPDATED).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await roadmapService.remove(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.ROADMAP.DELETED).send(res);
});

const addMilestone = asyncHandler(async (req, res) => {
  const data = await roadmapService.addMilestone(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { roadmap: data }, MESSAGES.ROADMAP.UPDATED).send(res);
});

const updateMilestone = asyncHandler(async (req, res) => {
  const data = await roadmapService.updateMilestone(
    req.user.id,
    req.params.id,
    req.params.milestoneId,
    req.body
  );
  return new ApiResponse(STATUS_CODES.OK, { roadmap: data }, MESSAGES.ROADMAP.MILESTONE_UPDATED).send(res);
});

const deleteMilestone = asyncHandler(async (req, res) => {
  const data = await roadmapService.deleteMilestone(
    req.user.id,
    req.params.id,
    req.params.milestoneId
  );
  return new ApiResponse(STATUS_CODES.OK, { roadmap: data }, MESSAGES.ROADMAP.UPDATED).send(res);
});

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