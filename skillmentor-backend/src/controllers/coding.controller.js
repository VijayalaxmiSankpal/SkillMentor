'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const codingService = require('../services/coding.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const create = asyncHandler(async (req, res) => {
  const log = await codingService.create(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { log }, MESSAGES.CODING.CREATED).send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await codingService.list(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.CODING.FETCHED).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const log = await codingService.getById(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { log }, MESSAGES.CODING.FETCHED).send(res);
});

const update = asyncHandler(async (req, res) => {
  const log = await codingService.update(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { log }, MESSAGES.CODING.UPDATED).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await codingService.remove(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.CODING.DELETED).send(res);
});

const stats = asyncHandler(async (req, res) => {
  const data = await codingService.getStats(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.CODING.STATS_FETCHED).send(res);
});

module.exports = { create, list, getById, update, remove, stats };