'use strict';

const Course = require('../models/course.model');
const ApiError = require('../utils/ApiError');

const enroll = async (userId, payload) => {
  const existing = await Course.findOne({
    user: userId,
    title: payload.title,
    isDeleted: false,
  });

  if (existing) {
    return existing;
  }

  return Course.create({
    user: userId,
    title: payload.title,
    topic: payload.topic,
    author: payload.author,
    level: payload.level,
    duration: payload.duration,
    sourceUrl: payload.sourceUrl || '',
    lessons: payload.lessons || [],
  });
};

const list = async (userId) => {
  const items = await Course.find({
    user: userId,
    isDeleted: false,
  }).sort({ updatedAt: -1 });

  return { items };
};

const updateLesson = async (
  userId,
  courseId,
  lessonId,
  completed
) => {
  const course = await Course.findOne({
    _id: courseId,
    user: userId,
    isDeleted: false,
  });

  if (!course) {
    throw ApiError.notFound('Course not found');
  }

  const lesson = course.lessons.id(lessonId);

  if (!lesson) {
    throw ApiError.notFound('Lesson not found');
  }

  lesson.completed = completed;
  lesson.completedAt = completed ? new Date() : null;

  await course.save();

  return course;
};

const remove = async (userId, courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    user: userId,
    isDeleted: false,
  });

  if (!course) {
    throw ApiError.notFound('Course not found');
  }

  course.isDeleted = true;

  await course.save();
};

module.exports = {
  enroll,
  list,
  updateLesson,
  remove,
};