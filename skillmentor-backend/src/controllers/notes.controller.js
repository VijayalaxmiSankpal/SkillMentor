'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const notesService = require('../services/notes.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const create = asyncHandler(async (req, res) => {
  const note = await notesService.create(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { note }, MESSAGES.NOTE.CREATED).send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await notesService.list(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.NOTE.FETCHED).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const note = await notesService.getById(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { note }, MESSAGES.NOTE.FETCHED).send(res);
});

const update = asyncHandler(async (req, res) => {
  const note = await notesService.update(req.user.id, req.params.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { note }, MESSAGES.NOTE.UPDATED).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await notesService.remove(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.NOTE.DELETED).send(res);
});

module.exports = { create, list, getById, update, remove };