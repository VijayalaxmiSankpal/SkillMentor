'use strict';

const mongoose = require('mongoose');

const savedQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: '',
      trim: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      default: '',
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'],
      default: 'Medium',
    },

    type: {
      type: String,
      default: 'Technical',
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

savedQuestionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SavedQuestion', savedQuestionSchema);