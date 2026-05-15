'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');

const routes = require('./routes');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Security Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Prevent Parameter Pollution
app.use(hpp());

// Compression
app.use(compression());

// Logger
app.use(morgan('dev'));

// Root Route
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 SkillMentor Backend is running',
    version: 'v1',
    docs: '/api/v1/health',
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 Middleware
app.use(notFoundMiddleware);

// Global Error Middleware
app.use(errorMiddleware);

module.exports = app;