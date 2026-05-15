'use strict';

const nodemailer = require('nodemailer');
const env = require('./env.config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false, // Mailtrap sandbox uses STARTTLS
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

// Verify SMTP connection on boot (non-blocking)
transporter
  .verify()
  .then(() => logger.info('✅ SMTP server ready'))
  .catch((err) => logger.error(`SMTP verification failed: ${err.message}`));

module.exports = transporter;