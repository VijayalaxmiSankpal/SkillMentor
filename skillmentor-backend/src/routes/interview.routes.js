'use strict';

const express = require('express');
const ctrl = require('../controllers/interview.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  upsertPrepSchema,
  addTopicSchema,
  updateTopicSchema,
  subjectParamSchema,
  topicParamSchema,
} = require('../validators/interview.validator');

const router = express.Router();

router.use(authenticate);

router.get('/weak-topics', ctrl.weakTopics);

router
  .route('/')
  .get(ctrl.listAll)
  .put(validate(upsertPrepSchema), ctrl.upsert);

router.get('/:subject', validate(subjectParamSchema, 'params'), ctrl.getBySubject);

router.post(
  '/:subject/topics',
  validate(subjectParamSchema, 'params'),
  validate(addTopicSchema),
  ctrl.addTopic
);

router
  .route('/:subject/topics/:topicId')
  .patch(validate(topicParamSchema, 'params'), validate(updateTopicSchema), ctrl.updateTopic)
  .delete(validate(topicParamSchema, 'params'), ctrl.deleteTopic);

module.exports = router;