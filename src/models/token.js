const mongoose = require('mongoose');

const { Schema } = mongoose;

const TokenSchema = new Schema(
  {
    accessToken: {
      // token string
      type: String,
      required: true,
      unique: true,
    },
    accessTokenExpiresAt: {
      // expiration date
      type: Date,
      required: true,
    },
    refreshToken: {
      // refresh token string
      type: String,
      required: true,
      unique: true,
    },
    refreshTokenExpiresAt: {
      // refresh token expiration date
      type: Date,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // user who requested token
    client: {
      type: String,
      required: true,
    }, // client who requested token
  },
  { collection: 'token' }
);

TokenSchema.set('versionKey', false);

module.exports = mongoose.model('Token', TokenSchema);
