'use strict';

const express = require('express');
const ctrl = require('../controllers/resume.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimit.middleware');
const { handleResumeUpload } = require('../middleware/upload.middleware');
const { uploadResumeSchema, idParamSchema } = require('../validators/resume.validator');

const router = express.Router();

router.use(authenticate);

router.post(
  '/upload',
  aiLimiter,
  handleResumeUpload,
  validate(uploadResumeSchema),
  ctrl.upload
);

router.get('/', ctrl.list);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
router.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = router;