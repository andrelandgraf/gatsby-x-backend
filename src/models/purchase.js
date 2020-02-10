const mongoose = require('mongoose');

const { Schema } = mongoose;

const PurchaseSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    success: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  { collection: 'purchase', timestamps: true }
);

PurchaseSchema.set('versionKey', false);

module.exports = mongoose.model('Purchase', PurchaseSchema);
