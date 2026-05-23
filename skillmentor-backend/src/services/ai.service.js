'use strict';
const SavedQuestion = require('../models/savedQuestion.model');
const mongoose = require('mongoose');
const aiClient = require('../ai/ai.client');
const AIChat = require('../models/aiChat.model');
const CodingLog = require('../models/codingLog.model');
const InterviewPrep = require('../models/interviewPrep.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');

const { buildMentorSystemPrompt } = require('../ai/prompts/mentor.prompt');
const { buildInterviewPrompt } = require('../ai/prompts/interview.prompt');
const { buildWeakTopicPrompt } = require('../ai/prompts/weakTopic.prompt');
const { buildStudyPlanPrompt } = require('../ai/prompts/studyPlan.prompt');

/* ----------------------------------------------------------
 * Helper: format chat history for Groq
 * ---------------------------------------------------------- */
const formatHistoryForGemini = (messages = []) =>
  messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

/* ----------------------------------------------------------
 * AI Mentor (chat with history)
 * ---------------------------------------------------------- */
const mentorChat = async (userId, { chatId, message }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  let chat;
  if (chatId) {
    chat = await AIChat.findOne({ _id: chatId, isDeleted: false });
    ensureOwner(chat, userId, 'Chat');
  } else {
    chat = await AIChat.create({
      user: userId,
      context: 'mentor',
      title: message.slice(0, 60),
      messages: [
        { role: 'system', content: buildMentorSystemPrompt(user) },
      ],
    });
  }

  // Prepend system prompt for Gemini context
  const systemPrompt = chat.messages.find((m) => m.role === 'system')?.content
    || buildMentorSystemPrompt(user);

  // Construct history (system prompt baked into first user turn for Gemini)
  const history = formatHistoryForGemini(chat.messages);
  const augmentedMessage = chat.messages.filter((m) => m.role !== 'system').length === 0
    ? `${systemPrompt}\n\nUser question: ${message}`
    : message;

  const aiReply = await aiClient.generateChat(history, augmentedMessage);

  chat.messages.push({ role: 'user', content: message });
  chat.messages.push({ role: 'assistant', content: aiReply });

  // Keep history bounded (last 40 messages + system)
  if (chat.messages.length > 41) {
    const system = chat.messages.find((m) => m.role === 'system');
    chat.messages = [system, ...chat.messages.slice(-40)].filter(Boolean);
  }

  await chat.save();

  return { chatId: chat._id, reply: aiReply, chat };
};

/* ----------------------------------------------------------
 * Chat history
 * ---------------------------------------------------------- */
const listChats = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, isDeleted: false };
  if (query.context) filter.context = query.context;

  const [items, total] = await Promise.all([
    AIChat.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).select('-messages'),
    AIChat.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ total, page, limit }) };
};

const getChat = async (userId, chatId) => {
  const chat = await AIChat.findOne({ _id: chatId, isDeleted: false });
  ensureOwner(chat, userId, 'Chat');
  return chat;
};

const deleteChat = async (userId, chatId) => {
  const chat = await AIChat.findOne({ _id: chatId, isDeleted: false });
  ensureOwner(chat, userId, 'Chat');
  chat.isDeleted = true;
  await chat.save();
};

/* ----------------------------------------------------------
 * Interview Questions
 * ---------------------------------------------------------- */
const generateInterviewQuestions = async (payload) => {
  const prompt = buildInterviewPrompt(payload);
  const data = await aiClient.generateJSON(prompt);

  if (!data || !Array.isArray(data.questions)) {
    throw ApiError.internal('AI returned invalid question format');
  }
  return data;
};

/* ----------------------------------------------------------
 * Weak Topic Analyzer
 * ---------------------------------------------------------- */
const analyzeWeakTopics = async (userId) => {
  const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

  // Coding summary
  const codingAgg = await CodingLog.aggregate([
    { $match: { user: objectUserId, isDeleted: false } },
    {
      $group: {
        _id: '$topic',
        count: { $sum: 1 },
        avgTime: { $avg: '$timeSpentMinutes' },
        revisitCount: { $sum: { $cond: [{ $eq: ['$status', 'revisit'] }, 1, 0] } },
      },
    },
    { $sort: { count: 1 } },
    { $limit: 20 },
  ]);

  const codingSummary = codingAgg.map((c) => ({
    topic: c._id,
    solved: c.count,
    avgTimeMinutes: Math.round(c.avgTime || 0),
    needsRevisit: c.revisitCount,
  }));

  // Interview weak topics
  const preps = await InterviewPrep.find({ user: userId, isDeleted: false });
  const interviewWeak = [];
  preps.forEach((p) => {
    p.topics.filter((t) => t.isWeak).forEach((t) => {
      interviewWeak.push({
        subject: p.subject,
        topic: t.name,
        confidence: t.confidence,
      });
    });
  });

  if (codingSummary.length === 0 && interviewWeak.length === 0) {
    return {
      message: 'Not enough data to analyze. Log some coding practice and interview prep first.',
      weakAreas: [],
      recommendations: [],
      revisionPlan: {},
    };
  }

  const prompt = buildWeakTopicPrompt({ codingSummary, interviewWeak });
  return aiClient.generateJSON(prompt);
};

/* ----------------------------------------------------------
 * Study Plan Generator
 * ---------------------------------------------------------- */
const generateStudyPlan = async (payload) => {
  const prompt = buildStudyPlanPrompt(payload);
  return aiClient.generateJSON(prompt);
};

const saveQuestion = async (userId, payload) => {
  return SavedQuestion.create({
    user: userId,
    role: payload.role,
    topic: payload.topic,
    question: payload.question,
    answer: payload.answer,
    difficulty: payload.difficulty,
    type: payload.type,
  });
};

const listSavedQuestions = async (userId) => {
  const items = await SavedQuestion.find({
    user: userId,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return { items };
};

const deleteSavedQuestion = async (userId, id) => {
  const question = await SavedQuestion.findOne({
    _id: id,
    user: userId,
    isDeleted: false,
  });

  if (!question) {
    throw ApiError.notFound('Saved question not found');
  }

  question.isDeleted = true;
  await question.save();
};

module.exports = {
  mentorChat,
  listChats,
  getChat,
  deleteChat,
  generateInterviewQuestions,
  analyzeWeakTopics,
  generateStudyPlan,
  saveQuestion,
listSavedQuestions,
deleteSavedQuestion,
};