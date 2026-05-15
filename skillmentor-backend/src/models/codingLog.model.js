'use strict';

const mongoose = require('mongoose');

const codingLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionTitle: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: 200,
    },
    platform: {
      type: String,
      enum: ['leetcode', 'codeforces', 'codechef', 'gfg', 'hackerrank', 'atcoder', 'other'],
      default: 'leetcode',
      index: true,
    },
    questionUrl: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],

    status: {
      type: String,
      enum: ['solved', 'attempted', 'revisit'],
      default: 'solved',
      index: true,
    },

    timeSpentMinutes: { type: Number, default: 0, min: 0 },

    notes: { type: String, default: '', maxlength: 2000 },

    solvedAt: { type: Date, default: Date.now, index: true },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

codingLogSchema.index({ user: 1, solvedAt: -1, isDeleted: 1 });
codingLogSchema.index({ user: 1, topic: 1 });

module.exports = mongoose.model('CodingLog', codingLogSchema);