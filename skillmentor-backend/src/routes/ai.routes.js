'use strict';

const express = require('express');
const ctrl = require('../controllers/ai.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimit.middleware');
const {
  mentorChatSchema,
  interviewQuestionsSchema,
  studyPlanSchema,
  idParamSchema,
} = require('../validators/ai.validator');

const router = express.Router();

router.use(authenticate);
router.use(aiLimiter);

// Mentor
router.post('/mentor', validate(mentorChatSchema), ctrl.mentorChat);

// Chat history
router.get('/chats', ctrl.listChats);
router.get('/chats/:id', validate(idParamSchema, 'params'), ctrl.getChat);
router.delete('/chats/:id', validate(idParamSchema, 'params'), ctrl.deleteChat);

// Generators
router.post('/interview-questions', validate(interviewQuestionsSchema), ctrl.interviewQuestions);
router.get('/weak-analysis', ctrl.weakAnalysis);
router.post('/study-plan', validate(studyPlanSchema), ctrl.studyPlan);

// Saved Questions
router.post('/saved-questions', ctrl.saveQuestion);
router.get('/saved-questions', ctrl.listSavedQuestions);
router.delete('/saved-questions/:id', validate(idParamSchema, 'params'), ctrl.deleteSavedQuestion);

module.exports = router;