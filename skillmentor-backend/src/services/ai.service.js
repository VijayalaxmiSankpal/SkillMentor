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
const { buildWeakTopicPrompt } = require('../ai/prompts/weakTopic.prompt');
const { buildStudyPlanPrompt } = require('../ai/prompts/studyPlan.prompt');

const formatHistoryForGemini = (messages = []) =>
  messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

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
        {
          role: 'system',
          content: buildMentorSystemPrompt(user),
        },
      ],
    });
  }

  const systemPrompt =
    chat.messages.find((m) => m.role === 'system')?.content ||
    buildMentorSystemPrompt(user);

  const history = formatHistoryForGemini(chat.messages);

  const augmentedMessage =
    chat.messages.filter((m) => m.role !== 'system').length === 0
      ? `${systemPrompt}\n\nUser question: ${message}`
      : message;

  const aiReply = await aiClient.generateChat(history, augmentedMessage);

  chat.messages.push({ role: 'user', content: message });
  chat.messages.push({ role: 'assistant', content: aiReply });

  if (chat.messages.length > 41) {
    const system = chat.messages.find((m) => m.role === 'system');
    chat.messages = [system, ...chat.messages.slice(-40)].filter(Boolean);
  }

  await chat.save();

  return {
    chatId: chat._id,
    reply: aiReply,
    chat,
  };
};

const listChats = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {
    user: userId,
    isDeleted: false,
  };

  if (query.context) {
    filter.context = query.context;
  }

  const [items, total] = await Promise.all([
    AIChat.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-messages'),

    AIChat.countDocuments(filter),
  ]);

  return {
    items,
    meta: buildMeta({ total, page, limit }),
  };
};

const getChat = async (userId, chatId) => {
  const chat = await AIChat.findOne({
    _id: chatId,
    isDeleted: false,
  });

  ensureOwner(chat, userId, 'Chat');

  return chat;
};

const deleteChat = async (userId, chatId) => {
  const chat = await AIChat.findOne({
    _id: chatId,
    isDeleted: false,
  });

  ensureOwner(chat, userId, 'Chat');

  chat.isDeleted = true;

  await chat.save();
};

const buildInterviewQuestionPrompt = (payload) => {
  const role = payload.role || 'Software Developer';
  const type = payload.type || 'technical';
  const difficulty = payload.difficulty || 'medium';
  const skills = Array.isArray(payload.skills) ? payload.skills : [];
  const count = Number(payload.count || 5);

  return `
You are a senior technical interviewer.

Generate ${count} interview preparation questions.

Role: ${role}
Interview type: ${type}
Difficulty: ${difficulty}
Skills/topics: ${skills.join(', ') || 'general software development'}

IMPORTANT:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.
- Every question MUST include a clear ideal answer.
- The answer should be helpful but concise, around 4 to 6 lines.
- Difficulty must be one of: Easy, Medium, Hard.

Return EXACTLY this JSON shape:
{
  "questions": [
    {
      "question": "Write the interview question here",
      "answer": "Write the ideal answer here in 4 to 6 lines",
      "difficulty": "Medium"
    }
  ]
}
`.trim();
};

const generateInterviewQuestions = async (payload) => {
  const prompt = buildInterviewQuestionPrompt(payload);

  const data = await aiClient.generateJSON(prompt);

  if (!data || !Array.isArray(data.questions)) {
    throw ApiError.internal('AI returned invalid question format');
  }

  data.questions = data.questions.map((item) => ({
    question: item.question || '',
    answer:
      item.answer ||
      item.expectedAnswer ||
      item.explanation ||
      item.sampleAnswer ||
      item.modelAnswer ||
      item.idealAnswer ||
      '',
    difficulty: item.difficulty || 'Medium',
  }));

  return data;
};

const analyzeWeakTopics = async (userId) => {
  const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

  const codingAgg = await CodingLog.aggregate([
    {
      $match: {
        user: objectUserId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$topic',
        count: { $sum: 1 },
        avgTime: { $avg: '$timeSpentMinutes' },
        revisitCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'revisit'] }, 1, 0],
          },
        },
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

  const preps = await InterviewPrep.find({
    user: userId,
    isDeleted: false,
  });

  const interviewWeak = [];

  preps.forEach((p) => {
    p.topics
      .filter((t) => t.isWeak)
      .forEach((t) => {
        interviewWeak.push({
          subject: p.subject,
          topic: t.name,
          confidence: t.confidence,
        });
      });
  });

  if (codingSummary.length === 0 && interviewWeak.length === 0) {
    return {
      message:
        'Not enough data to analyze. Log some coding practice and interview prep first.',
      weakAreas: [],
      recommendations: [],
      revisionPlan: {},
    };
  }

  const prompt = buildWeakTopicPrompt({
    codingSummary,
    interviewWeak,
  });

  return aiClient.generateJSON(prompt);
};

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

  return {
    items,
  };
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

const evaluateAnswer = async (payload) => {
  const prompt = `
You are a senior technical interviewer.

Evaluate the user's answer.

Question:
${payload.question}

User Answer:
${payload.userAnswer}

Ideal Answer:
${payload.idealAnswer || 'Not provided'}

Return ONLY valid JSON in this exact format:
{
  "score": 0,
  "isCorrect": false,
  "feedback": "short explanation",
  "strengths": ["point"],
  "missingPoints": ["point"],
  "idealAnswer": "clear ideal answer"
}

Rules:
- score must be from 0 to 10
- isCorrect should be true only if the answer is mostly correct
- feedback should clearly say whether the answer is correct, partially correct, or incorrect
`.trim();

  return aiClient.generateJSON(prompt);
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
  evaluateAnswer,
};