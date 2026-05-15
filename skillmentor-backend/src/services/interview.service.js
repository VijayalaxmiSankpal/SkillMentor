'use strict';

const InterviewPrep = require('../models/interviewPrep.model');
const ApiError = require('../utils/ApiError');

const upsert = async (userId, { subject, topics }) => {
  const prep = await InterviewPrep.findOneAndUpdate(
    { user: userId, subject },
    { $setOnInsert: { user: userId, subject }, $set: { topics } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );
  return prep;
};

const listAll = async (userId) => {
  return InterviewPrep.find({ user: userId, isDeleted: false }).sort({ subject: 1 });
};

const getBySubject = async (userId, subject) => {
  const prep = await InterviewPrep.findOne({ user: userId, subject, isDeleted: false });
  if (!prep) throw ApiError.notFound('Interview prep not found for this subject');
  return prep;
};

const addTopic = async (userId, subject, topicPayload) => {
  let prep = await InterviewPrep.findOne({ user: userId, subject, isDeleted: false });
  if (!prep) {
    prep = await InterviewPrep.create({ user: userId, subject, topics: [topicPayload] });
    return prep;
  }
  prep.topics.push(topicPayload);
  await prep.save();
  return prep;
};

const updateTopic = async (userId, subject, topicId, payload) => {
  const prep = await InterviewPrep.findOne({ user: userId, subject, isDeleted: false });
  if (!prep) throw ApiError.notFound('Interview prep not found');

  const topic = prep.topics.id(topicId);
  if (!topic) throw ApiError.notFound('Topic not found');

  Object.assign(topic, payload);
  if (payload.confidence !== undefined) topic.lastRevisedAt = new Date();
  await prep.save();
  return prep;
};

const deleteTopic = async (userId, subject, topicId) => {
  const prep = await InterviewPrep.findOne({ user: userId, subject, isDeleted: false });
  if (!prep) throw ApiError.notFound('Interview prep not found');

  const topic = prep.topics.id(topicId);
  if (!topic) throw ApiError.notFound('Topic not found');

  topic.deleteOne();
  await prep.save();
  return prep;
};

const getWeakTopics = async (userId) => {
  const preps = await InterviewPrep.find({ user: userId, isDeleted: false });
  const weak = [];
  preps.forEach((p) => {
    p.topics.filter((t) => t.confidence <= 2).forEach((t) => {
      weak.push({
        subject: p.subject,
        topicId: t._id,
        name: t.name,
        confidence: t.confidence,
        lastRevisedAt: t.lastRevisedAt,
      });
    });
  });
  return weak;
};

module.exports = {
  upsert,
  listAll,
  getBySubject,
  addTopic,
  updateTopic,
  deleteTopic,
  getWeakTopics,
};