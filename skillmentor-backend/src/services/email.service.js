'use strict';

const transporter = require('../config/mail.config');
const env = require('../config/env.config');
const logger = require('../utils/logger');

const verifyEmailTemplate = require('../templates/verifyEmail.template');
const resetPasswordTemplate = require('../templates/resetPassword.template');
const welcomeTemplate = require('../templates/welcome.template');

/**
 * Generic email sender.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${env.mail.fromName}" <${env.mail.fromEmail}>`,
      to,
      subject,
      html,
    });
    logger.info(`📧 Email sent → ${to} | id: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed → ${to}: ${error.message}`);
    throw error;
  }
};

const sendVerificationEmail = async ({ to, name, verifyUrl }) => {
  return sendEmail({
    to,
    subject: 'Verify your SkillMentor account',
    html: verifyEmailTemplate({ name, verifyUrl }),
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  return sendEmail({
    to,
    subject: 'Reset your SkillMentor password',
    html: resetPasswordTemplate({ name, resetUrl }),
  });
};

const sendWelcomeEmail = async ({ to, name }) => {
  return sendEmail({
    to,
    subject: 'Welcome to SkillMentor 🎉',
    html: welcomeTemplate({ name }),
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};