'use strict';

const express = require('express');
const ctrl = require('../controllers/roadmap.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createRoadmapSchema,
  updateRoadmapSchema,
  updateMilestoneSchema,
  idParamSchema,
  milestoneParamsSchema,
} = require('../validators/roadmap.validator');

const router = express.Router();

router.use(authenticate); // All routes protected

router
  .route('/')
  .post(validate(createRoadmapSchema), ctrl.create)
  .get(ctrl.list);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), ctrl.getById)
  .patch(validate(idParamSchema, 'params'), validate(updateRoadmapSchema), ctrl.update)
  .delete(validate(idParamSchema, 'params'), ctrl.remove);

router.post(
  '/:id/milestones',
  validate(idParamSchema, 'params'),
  validate(updateMilestoneSchema),
  ctrl.addMilestone
);

router
  .route('/:id/milestones/:milestoneId')
  .patch(validate(milestoneParamsSchema, 'params'), validate(updateMilestoneSchema), ctrl.updateMilestone)
  .delete(validate(milestoneParamsSchema, 'params'), ctrl.deleteMilestone);

module.exports = router;