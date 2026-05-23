'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/mockInterview.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const create = asyncHandler(async (req, res) => {
  const interview = await service.create(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { interview }, MESSAGES.MOCK.CREATED).send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await service.list(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.MOCK.FETCHED).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const interview = await service.getById(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { interview }, MESSAGES.MOCK.FETCHED).send(res);
});

const update = asyncHandler(async (req, res) => {
  const interview = await service.update(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { interview }, MESSAGES.MOCK.UPDATED).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.MOCK.DELETED).send(res);
});

const saveFeedback = asyncHandler(async (req, res) => {
  const interview = await service.saveFeedback(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { interview }, MESSAGES.MOCK.FEEDBACK_SAVED).send(res);
});
const evaluateAnswers = asyncHandler(async (req, res) => {
  const interview = await service.evaluateAnswers(
    req.user.id,
    req.params.id,
    req.body
  );

  return new ApiResponse(
    STATUS_CODES.OK,
    { interview },
    'Interview evaluated successfully'
  ).send(res);
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  saveFeedback,
  evaluateAnswers,
};