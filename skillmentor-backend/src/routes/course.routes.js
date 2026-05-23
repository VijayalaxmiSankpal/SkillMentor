'use strict';

const express = require('express');
const ctrl = require('../controllers/course.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/enroll', ctrl.enroll);
router.get('/', ctrl.list);
router.patch('/:courseId/lessons/:lessonId', ctrl.updateLesson);
router.delete('/:courseId', ctrl.remove);

module.exports = router;