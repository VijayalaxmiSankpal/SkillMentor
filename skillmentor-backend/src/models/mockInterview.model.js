'use strict';

const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, maxlength: 1000 },
    answer: { type: String, default: '', maxlength: 5000 },
    score: { type: Number, min: 0, max: 10, default: 0 },
    feedback: { type: String, default: '', maxlength: 2000 },
  },
  { _id: true }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: 80,
    },
    type: {
      type: String,
      enum: ['technical', 'hr', 'system-design', 'behavioral', 'mixed'],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    durationMinutes: { type: Number, default: 30, min: 5, max: 240 },
    scheduledAt: { type: Date },
    questions: [questionAnswerSchema],

    overallScore: { type: Number, min: 0, max: 10, default: 0 },
    overallFeedback: { type: String, default: '', maxlength: 5000 },
    strengths: [{ type: String, trim: true }],
    weaknesses: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },

    isAIGenerated: { type: Boolean, default: false },

    completedAt: { type: Date },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

mockInterviewSchema.index({ user: 1, status: 1, createdAt: -1 });

// Auto-compute overall score from question scores
mockInterviewSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    const scored = this.questions.filter((q) => q.score > 0);
    if (scored.length > 0) {
      const sum = scored.reduce((acc, q) => acc + q.score, 0);
      this.overallScore = Number((sum / scored.length).toFixed(2));
    }
  }
  next();
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);