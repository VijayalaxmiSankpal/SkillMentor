'use strict';

const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    confidence: { type: Number, min: 1, max: 5, default: 3 }, // 1=weak, 5=strong
    isWeak: { type: Boolean, default: false },
    notes: { type: String, default: '', maxlength: 1000 },
    lastRevisedAt: { type: Date },
  },
  { _id: true, timestamps: true }
);

const interviewPrepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      enum: [
  'frontend',
  'backend',
  'fullstack',
  'dsa',
  'dbms',
  'os',
  'cn',
  'aptitude',
  'hr',
  'system-design',
],
      required: true,
      index: true,
    },
    topics: [topicSchema],

    overallProgress: { type: Number, default: 0, min: 0, max: 100 },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// One prep record per (user, subject) combo
interviewPrepSchema.index({ user: 1, subject: 1 }, { unique: true });

// Auto-flag weak topics & compute progress
interviewPrepSchema.pre('save', function (next) {
  if (this.topics && this.topics.length > 0) {
    this.topics.forEach((t) => {
      t.isWeak = t.confidence <= 2;
    });
    const sum = this.topics.reduce((acc, t) => acc + t.confidence, 0);
    const max = this.topics.length * 5;
    this.overallProgress = Math.round((sum / max) * 100);
  } else {
    this.overallProgress = 0;
  }
  next();
});

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);