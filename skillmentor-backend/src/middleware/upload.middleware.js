'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, safeName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['application/pdf'];
  if (!allowed.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('resume');

/**
 * Wrap multer to forward errors to global handler.
 */
const handleResumeUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('File too large. Max 5MB.'));
      }
      return next(ApiError.badRequest(err.message));
    } else if (err) {
      return next(err);
    }
    if (!req.file) {
      return next(ApiError.badRequest('Resume file is required'));
    }
    next();
  });
};

module.exports = { handleResumeUpload };