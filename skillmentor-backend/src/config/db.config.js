'use strict';

const mongoose = require('mongoose');
const env = require('./env.config');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB with retry logic.
 * Why retry? Network blips shouldn't crash the entire app.
 */
const connectDB = async (retries = 5, delayMs = 5000) => {
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(env.db.uri, {
        serverSelectionTimeoutMS: 10000,
      });

      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Mongoose connection event listeners
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️  MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('🔄 MongoDB reconnected');
      });

      return conn;
    } catch (error) {
      retries -= 1;
      logger.error(`❌ MongoDB connection failed: ${error.message}`);
      logger.warn(`Retries left: ${retries}`);

      if (retries === 0) {
        logger.error('💥 Could not connect to MongoDB. Exiting.');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully');
  } catch (error) {
    logger.error(`Error disconnecting MongoDB: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };