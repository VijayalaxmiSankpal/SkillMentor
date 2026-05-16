'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true, maxlength: 20000 },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, default: 'New Chat', maxlength: 120 },
    context: {
      type: String,
      enum: ['mentor', 'interview', 'study-plan', 'weak-topic', 'general'],
      default: 'general',
      index: true,
    },
    messages: [messageSchema],

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

aiChatSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AIChat', aiChatSchema);