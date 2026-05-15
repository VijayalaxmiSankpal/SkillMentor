'use strict';

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data', 'ai-ml', 'other'],
      default: 'other',
      index: true,
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);