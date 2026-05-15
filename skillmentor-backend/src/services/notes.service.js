'use strict';

const Note = require('../models/note.model');
const { ensureOwner } = require('../helpers/ownership.helper');
const { getPagination, buildMeta } = require('../helpers/pagination.helper');

const create = async (userId, payload) => {
  return Note.create({ ...payload, user: userId });
};

const list = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, isDeleted: false };

  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = query.tag.toLowerCase();
  if (query.pinned === 'true') filter.isPinned = true;

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { content: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = { isPinned: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Note.find(filter).sort(sort).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ total, page, limit }) };
};

const getById = async (userId, id) => {
  const note = await Note.findOne({ _id: id, isDeleted: false });
  ensureOwner(note, userId, 'Note');
  return note;
};

const update = async (userId, id, payload) => {
  const note = await Note.findOne({ _id: id, isDeleted: false });
  ensureOwner(note, userId, 'Note');
  Object.assign(note, payload);
  await note.save();
  return note;
};

const remove = async (userId, id) => {
  const note = await Note.findOne({ _id: id, isDeleted: false });
  ensureOwner(note, userId, 'Note');
  note.isDeleted = true;
  await note.save();
};

module.exports = { create, list, getById, update, remove };