'use strict';
const aiClient=require('../ai/ai.client');
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
const evaluateAnswers = async (userId, id, payload) => {
  const interview = await MockInterview.findOne({
    _id: id,
    isDeleted: false,
  });

  ensureOwner(interview, userId, 'MockInterview');

  const prompt = `
You are a senior interviewer.

Evaluate these mock interview answers for role: ${interview.role}.
Interview type: ${interview.type}.
Difficulty: ${interview.difficulty}.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "string",
      "answer": "string",
      "score": 0,
      "feedback": "short feedback telling if answer is correct, partially correct, or incorrect"
    }
  ],
  "overallScore": 0,
  "overallFeedback": "overall performance feedback",
  "strengths": ["strength"],
  "weaknesses": ["weakness"]
}

Answers:
${JSON.stringify(payload.answers)}
`;

  const result = await aiClient.generateJSON(prompt);

  interview.questions = result.questions || [];
  interview.overallScore = result.overallScore || 0;
  interview.overallFeedback = result.overallFeedback || '';
  interview.strengths = result.strengths || [];
  interview.weaknesses = result.weaknesses || [];
  interview.status = 'completed';
  interview.completedAt = new Date();

  await interview.save();

  return interview;
};
module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  saveFeedback,
  evaluateAnswers,
};