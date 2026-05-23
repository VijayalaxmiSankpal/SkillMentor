'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const courseService = require('../services/course.service');
const { STATUS_CODES } = require('../constants');

const enroll = asyncHandler(async (req, res) => {
  const course = await courseService.enroll(req.user.id, req.body);
  return new ApiResponse(STATUS_CODES.CREATED, { course }, 'Course enrolled successfully').send(res);
});

const list = asyncHandler(async (req, res) => {
  const data = await courseService.list(req.user.id);
  return new ApiResponse(STATUS_CODES.OK, data, 'Courses fetched successfully').send(res);
});

const updateLesson = asyncHandler(async (req, res) => {
  const course = await courseService.updateLesson(
    req.user.id,
    req.params.courseId,
    req.params.lessonId,
    req.body.completed
  );

  return new ApiResponse(STATUS_CODES.OK, { course }, 'Lesson progress updated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await courseService.remove(req.user.id, req.params.courseId);
  return new ApiResponse(STATUS_CODES.OK, null, 'Course removed successfully').send(res);
});

module.exports = {
  enroll,
  list,
  updateLesson,
  remove,
};