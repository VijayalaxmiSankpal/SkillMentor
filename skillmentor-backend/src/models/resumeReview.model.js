'use strict';

const mongoose = require('mongoose');

const resumeReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },

    extractedText: { type: String, default: '' },

    targetRole: { type: String, default: '', maxlength: 80 },

    atsScore: { type: Number, min: 0, max: 100, default: 0 },

   feedback: {
  summary: { type: String, default: '' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  matchedKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  sections: [
    {
      name: { type: String, default: "" },
      score: { type: Number, default: 0 },
      status: { type: String, default: "warning" },
      feedback: { type: String, default: "" },
    },
  ],
},

    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

resumeReviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeReview', resumeReviewSchema);