'use strict';

const express = require('express');
const ctrl = require('../controllers/coding.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { createSchema, updateSchema, idParamSchema } = require('../validators/coding.validator');

const router = express.Router();

router.use(authenticate);

router.get('/stats', ctrl.stats);

router
  .route('/')
  .post(validate(createSchema), ctrl.create)
  .get(ctrl.list);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), ctrl.getById)
  .patch(validate(idParamSchema, 'params'), validate(updateSchema), ctrl.update)
  .delete(validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;