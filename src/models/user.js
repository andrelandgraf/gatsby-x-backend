const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      // unique username
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // password of user
      type: String,
      required: true,
    },
    givenName: {
      type: String,
    },
    familyName: {
      type: String,
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  },
  { collection: 'user', timestamps: true }
);

UserSchema.set('versionKey', false);

module.exports = mongoose.model('User', UserSchema);
