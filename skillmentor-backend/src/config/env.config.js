'use strict';

const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validate environment variables using Joi.
 * Why? Catch missing/invalid env vars at startup instead of crashing in production.
 */
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(5000),
  API_VERSION: Joi.string().default('v1'),

  MONGODB_URI: Joi.string().required().description('MongoDB connection string'),

  CLIENT_URL: Joi.string().uri().default('http://localhost:5173'),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),
  MAIL_FROM_EMAIL: Joi.string().email().required(),

  GROQ_API_KEY: Joi.string().required(),
GROQ_MODEL: Joi.string().default('llama3-8b-8192'),

  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().default(100),
}).unknown(true);

const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error('❌ Invalid environment variables:');
  error.details.forEach((d) => console.error(`   - ${d.message}`));
  process.exit(1);
}

const env = {
  nodeEnv: envVars.NODE_ENV,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,

  db: {
    uri: envVars.MONGODB_URI,
  },

  cors: {
    clientUrl: envVars.CLIENT_URL,
  },

  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    accessExpiry: envVars.JWT_ACCESS_EXPIRY,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
  },

  mail: {
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    user: envVars.MAIL_USER,
    pass: envVars.MAIL_PASS,
    fromName: envVars.MAIL_FROM_NAME,
    fromEmail: envVars.MAIL_FROM_EMAIL,
  },

  ai: {
  groqApiKey: envVars.GROQ_API_KEY,
  groqModel: envVars.GROQ_MODEL,
},

  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    max: envVars.RATE_LIMIT_MAX,
  },
};

module.exports = env;