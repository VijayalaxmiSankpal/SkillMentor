'use strict';

/**
 * Parse pagination params from req.query.
 * Defaults: page=1, limit=10, max limit=100.
 */
const getPagination = (query = {}) => {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build paginated response meta.
 */
const buildMeta = ({ total, page, limit }) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

module.exports = { getPagination, buildMeta };