const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    imageText: {
      type: String,
    },
    // homepage path
    link: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: 'item', timestamps: true }
);

ItemSchema.set('versionKey', false);

module.exports = mongoose.model('Item', ItemSchema);
