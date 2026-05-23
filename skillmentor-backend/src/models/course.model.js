'use strict';

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    author: {
      type: String,
      default: '',
    },

    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },

    duration: {
      type: String,
      default: '',
    },

    thumbnail: {
      type: String,
      default: '',
    },

    sourceUrl: {
      type: String,
      default: '',
    },

    lessons: [lessonSchema],

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    enrolled: {
      type: Boolean,
      default: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  const totalLessons = this.lessons.length;

  const completedLessons = this.lessons.filter(
    (lesson) => lesson.completed
  ).length;

  this.progress =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  this.isCompleted = this.progress === 100;

  next();
});

module.exports = mongoose.model('Course', courseSchema);