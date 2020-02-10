const { Types } = require('mongoose');

const { ERROR_TYPES } = require('../enums');
const ItemModel = require('../models/item');

const tag = 'controllers/item.js';

const getItems = async (req, res) => {
  console.tag(tag).info('get items called');
  const items = await ItemModel.find({});

  if (!items) {
    return res.status(200).json([]);
  }

  console.tag(tag).debug(items);

  return res.status(200).json(items);
};

const getItem = async (req, res) => {
  console.tag(tag).info('get item called');
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no id passed as url parameter',
      type: ERROR_TYPES.badRequest,
    });
  }
  const item = await ItemModel.findById(id);
  if (!item) {
    return res.status(404).json({
      error: 'NotFound',
      message: `could not find item with id ${id}`,
      type: ERROR_TYPES.ressourceNotFound,
    });
  }
  return res.status(200).json(item);
};

const createItem = async (req, res) => {
  console.tag(tag).info('create item called');
  const { item } = req.body;

  const created = await ItemModel.create(item);
  return res.status(200).json(created);
};

const updateItem = async (req, res) => {
  console.tag(tag).info('update item called');
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no id passed as url parameter',
      type: ERROR_TYPES.badRequest,
    });
  }
  const { item } = req.body;
  if (!item) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no item passed in body',
      type: ERROR_TYPES.badRequest,
    });
  }

  const updated = await ItemModel.updateOne({ _id: Types.ObjectId(id) }, item);
  return res.status(200).json(updated);
};

const deleteItem = async (req, res) => {
  console.tag(tag).info('delete item called');
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no id passed as url parameter',
      type: ERROR_TYPES.badRequest,
    });
  }
  const deleted = ItemModel.deleteOne({ _id: Types.ObjectId(id) });
  return res.status(200).json(deleted);
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
