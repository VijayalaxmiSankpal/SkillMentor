'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const interviewService = require('../services/interview.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const upsert = asyncHandler(async (req, res) => {
  const prep = await interviewService.upsert(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, { prep }, MESSAGES.INTERVIEW.UPSERTED).send(res);
});

const listAll = asyncHandler(async (req, res) => {
  const preps = await interviewService.listAll(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, { preps }, MESSAGES.INTERVIEW.FETCHED).send(res);
});

const getBySubject = asyncHandler(async (req, res) => {
  const prep = await interviewService.getBySubject(req.user.id, req.params.subject);
  return new ApiResponse(STATUS_CODES.OK, { prep }, MESSAGES.INTERVIEW.FETCHED).send(res);
});

const addTopic = asyncHandler(async (req, res) => {
  const prep = await interviewService.addTopic(req.user.id, req.params.subject, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { prep }, MESSAGES.INTERVIEW.UPSERTED).send(res);
});

const updateTopic = asyncHandler(async (req, res) => {
  const prep = await interviewService.updateTopic(
    req.user.id,
    req.params.subject,
    req.params.topicId,
    req.body
  );
  return new ApiResponse(STATUS_CODES.OK, { prep }, MESSAGES.INTERVIEW.TOPIC_UPDATED).send(res);
});

const deleteTopic = asyncHandler(async (req, res) => {
  const prep = await interviewService.deleteTopic(
    req.user.id,
    req.params.subject,
    req.params.topicId
  );
  return new ApiResponse(STATUS_CODES.OK, { prep }, MESSAGES.INTERVIEW.DELETED).send(res);
});

const weakTopics = asyncHandler(async (req, res) => {
  const weak = await interviewService.getWeakTopics(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, { weakTopics: weak }, MESSAGES.INTERVIEW.FETCHED).send(res);
});

module.exports = {
  upsert,
  listAll,
  getBySubject,
  addTopic,
  updateTopic,
  deleteTopic,
  weakTopics,
};