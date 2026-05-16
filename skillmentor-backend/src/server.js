'use strict';

const http = require('http');
const app = require('./app');
const env = require('./config/env.config');
const logger = require('./utils/logger');
const { connectDB, disconnectDB } = require('./config/db.config');

let server;

/**
 * Bootstrap function — connects DB then starts HTTP server.
 */
const startServer = async () => {
  try {
    await connectDB();

    server = http.createServer(app);

    server.listen(env.port, () => {
      logger.info(`🚀 Server running on port ${env.port} [${env.nodeEnv}]`);
      logger.info(`📡 API base URL: http://localhost:${env.port}/api/${env.apiVersion}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Graceful shutdown.
 * Why? Allow in-flight requests to finish & close DB cleanly.
 */
const gracefulShutdown = async (signal) => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

/* -------------------------------------------
 * Process-level error handlers
 * ------------------------------------------- */
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason instanceof Error ? reason.stack : reason}`);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.stack || error.message}`);
  gracefulShutdown('uncaughtException');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

/* -------------------------------------------
 * Start
 * ------------------------------------------- */
startServer();