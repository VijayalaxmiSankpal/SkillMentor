'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const resumeService = require('../services/resume.service');
const { STATUS_CODES } = require('../constants');

const upload = asyncHandler(async (req, res) => {
  const review = await resumeService.uploadAndReview(req.user.id, req.file, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { review }, 'Resume reviewed successfully').send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await resumeService.list(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, 'Resumes fetched').send(res);
});

const getById = asyncHandler(async (req, res) => {
  const review = await resumeService.getById(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { review }, 'Resume fetched').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await resumeService.remove(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, 'Resume deleted').send(res);
});

module.exports = { upload, list, getById, remove };