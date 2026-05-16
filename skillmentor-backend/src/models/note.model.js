'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: 50000,
    },
    tags: [{ type: String, lowercase: true, trim: true }],

    category: {
      type: String,
      enum: ['dsa', 'dbms', 'os', 'cn', 'system-design', 'frontend', 'backend', 'aptitude', 'hr', 'other'],
      default: 'other',
      index: true,
    },

    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Text index for search
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);