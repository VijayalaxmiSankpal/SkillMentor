'use strict';

const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const {
  signupSchema,
  loginSchema,
  emailOnlySchema,
  resetPasswordSchema,
  tokenParamSchema,
} = require('../validators/auth.validator');

const router = express.Router();

/* ── Public routes ────────────────────────────────────────── */
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);

router.get(
  '/verify-email/:token',
  validate(tokenParamSchema, 'params'),
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  authLimiter,
  validate(emailOnlySchema),
  authController.resendVerification
);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post(
  '/forgot-password',
  authLimiter,
  validate(emailOnlySchema),
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  validate(tokenParamSchema, 'params'),
  validate(resetPasswordSchema),
  authController.resetPassword
);

/* ── Protected routes ─────────────────────────────────────── */
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;