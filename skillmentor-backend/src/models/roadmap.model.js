'use strict';

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    resources: [{ type: String, trim: true }], // Links/URLs
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      maxlength: 80,
    },
    description: { type: String, default: '', maxlength: 1000 },

    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],

    milestones: [milestoneSchema],

    isAIGenerated: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
      index: true,
    },

    progress: { type: Number, default: 0, min: 0, max: 100 },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound index for fast user-scoped queries
roadmapSchema.index({ user: 1, status: 1, isDeleted: 1 });

// Auto-compute progress before save
roadmapSchema.pre('save', function (next) {
  if (this.milestones && this.milestones.length > 0) {
    const completed = this.milestones.filter((m) => m.isCompleted).length;
    this.progress = Math.round((completed / this.milestones.length) * 100);
    if (this.progress === 100 && this.status === 'active') {
      this.status = 'completed';
    }
  } else {
    this.progress = 0;
  }
  next();
});

module.exports = mongoose.model('Roadmap', roadmapSchema);