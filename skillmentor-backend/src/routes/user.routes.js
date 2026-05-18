'use strict';

const express = require('express');
const ctrl = require('../controllers/user.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/user.validator');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', ctrl.getDashboard);

router.patch('/me', validate(updateProfileSchema), ctrl.updateProfile);
router.post('/change-password', validate(changePasswordSchema), ctrl.changePassword);
router.delete('/me', ctrl.deleteAccount);

module.exports = router;