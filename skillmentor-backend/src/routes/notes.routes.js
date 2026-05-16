'use strict';

const express = require('express');
const ctrl = require('../controllers/notes.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createNoteSchema,
  updateNoteSchema,
  idParamSchema,
} = require('../validators/notes.validator');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(validate(createNoteSchema), ctrl.create)
  .get(ctrl.list);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), ctrl.getById)
  .patch(validate(idParamSchema, 'params'), validate(updateNoteSchema), ctrl.update)
  .delete(validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;