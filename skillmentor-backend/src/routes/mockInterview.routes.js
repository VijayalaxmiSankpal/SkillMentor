'use strict';

const express = require('express');
const ctrl = require('../controllers/mockInterview.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createSchema,
  updateSchema,
  feedbackSchema,
  idParamSchema,
} = require('../validators/mockInterview.validator');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(validate(createSchema), ctrl.create)
  .get(ctrl.list);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), ctrl.getById)
  .patch(validate(idParamSchema, 'params'), validate(updateSchema), ctrl.update)
  .delete(validate(idParamSchema, 'params'), ctrl.remove);

router.post(
  '/:id/feedback',
  validate(idParamSchema, 'params'),
  validate(feedbackSchema),
  ctrl.saveFeedback
);

module.exports = router;