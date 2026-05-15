'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const aiService = require('../services/ai.service');
const { STATUS_CODES, MESSAGES } = require('../constants');

const mentorChat = asyncHandler(async (req, res) => {
  const data = await aiService.mentorChat(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.OK, data, 'AI response generated').send(res);
});

const listChats = asyncHandler(async (req, res) => {
  const data = await aiService.listChats(req.user.id, req.query);
  return new ApiResponse(STATUS_CODES.OK, data, MESSAGES.GENERIC.FETCHED).send(res);
});

const getChat = asyncHandler(async (req, res) => {
  const chat = await aiService.getChat(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, { chat }, MESSAGES.GENERIC.FETCHED).send(res);
});

const deleteChat = asyncHandler(async (req, res) => {
  await aiService.deleteChat(req.user.id, req.params.id);
  return new ApiResponse(STATUS_CODES.OK, null, MESSAGES.GENERIC.DELETED).send(res);
});

const interviewQuestions = asyncHandler(async (req, res) => {
  const data = await aiService.generateInterviewQuestions(req.body);
  return new ApiResponse(STATUS_CODES.OK, data, 'Questions generated').send(res);
});

const weakAnalysis = asyncHandler(async (req, res) => {
  const data = await aiService.analyzeWeakTopics(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, data, 'Analysis complete').send(res);
});

const studyPlan = asyncHandler(async (req, res) => {
  const data = await aiService.generateStudyPlan(req.body);
  return new ApiResponse(STATUS_CODES.OK, data, 'Study plan generated').send(res);
});

module.exports = {
  mentorChat,
  listChats,
  getChat,
  deleteChat,
  interviewQuestions,
  weakAnalysis,
  studyPlan,
};