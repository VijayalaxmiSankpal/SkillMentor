'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const ResumeReview = require('../models/resumeReview.model');
const aiClient = require('../ai/ai.client');
const { buildResumePrompt } = require('../ai/prompts/resume.prompt');
const ApiError = require('../utils/ApiError');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');
const logger = require('../utils/logger');

const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return (data.text || '').trim();
};

const uploadAndReview = async (userId, file, { targetRole = '' }) => {
  // 1. Create initial record
  const review = await ResumeReview.create({
    user: userId,
    fileName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
    targetRole,
    status: 'processing',
  });

  try {
    // 2. Extract text
    const text = await extractPdfText(file.path);
    if (!text || text.length < 50) {
      throw ApiError.badRequest('Could not extract text from PDF. Make sure it is not a scanned image.');
    }
    review.extractedText = text.slice(0, 20000); // Cap stored text

    // 3. AI analysis
    const prompt = buildResumePrompt({ resumeText: text.slice(0, 12000), targetRole });
    const analysis = await aiClient.generateJSON(prompt);

    review.atsScore = Number(analysis.atsScore) || 0;
    review.feedback = {
      summary: analysis.summary || '',
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      suggestions: analysis.suggestions || [],
      missingKeywords: analysis.missingKeywords || [],
    };
    review.status = 'completed';
    await review.save();

    return review;
  } catch (err) {
    review.status = 'failed';
    await review.save();
    logger.error(`Resume review failed: ${err.message}`);
    throw err;
  }
};

const list = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, isDeleted: false };

  const [items, total] = await Promise.all([
    ResumeReview.find(filter)
      .select('-extractedText')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ResumeReview.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ total, page, limit }) };
};

const getById = async (userId, id) => {
  const review = await ResumeReview.findOne({ _id: id, isDeleted: false });
  ensureOwner(review, userId, 'Resume');
  return review;
};

const remove = async (userId, id) => {
  const review = await ResumeReview.findOne({ _id: id, isDeleted: false });
  ensureOwner(review, userId, 'Resume');

  // Delete file from disk
  try {
    if (review.filePath && fs.existsSync(review.filePath)) {
      fs.unlinkSync(review.filePath);
    }
  } catch (err) {
    logger.warn(`Could not delete resume file: ${err.message}`);
  }

  review.isDeleted = true;
  await review.save();
};

module.exports = { uploadAndReview, list, getById, remove };