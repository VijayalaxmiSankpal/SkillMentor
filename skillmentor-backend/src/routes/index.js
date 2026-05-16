'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

router.get('/health', (_req, res) => {
  return new ApiResponse(StatusCodes.OK, {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }, 'Server is healthy').send(res);
});

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/roadmaps', require('./roadmap.routes'));
router.use('/notes', require('./notes.routes'));
router.use('/coding', require('./coding.routes'));
router.use('/interview-prep', require('./interview.routes'));
router.use('/mock-interviews', require('./mockInterview.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/resume', require('./resume.routes'));

module.exports = router;