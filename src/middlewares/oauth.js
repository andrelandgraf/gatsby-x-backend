/**
 * oAuth2 method implementation as specified in
 * https://oauth2-server.readthedocs.io/en/latest/index.html
 */

const lodash = require('lodash');
const bcrypt = require('bcrypt');

const { ENV } = require('../enums');
const UserModel = require('../models/user');
const TokenModel = require('../models/token');

const tag = 'middlewares/oauth.js';

const clients = [
  {
    clientId: 'gatsbyx',
    clientSecret: ENV.GATSBYX_SECRET,
    grants: ['refresh_token', 'password'],
  },
];

/**
 * oAuth2 getUser function.
 * Gets user object from db & validates password.
 * @param email
 * @param password
 * @returns {Promise<undefined>}
 */
const getUser = async (email, password) => {
  console.tag(tag).debug('getUser-function called');

  const user = await UserModel.findOne({ email }).exec();
  const validPassword = user && bcrypt.compareSync(password, user.password);
  if (user) {
    user.password = undefined;
  }
  return validPassword ? user : undefined;
};

/**
 * oAuth2 getClient function
 * Retrieves client from db and validates secret.
 * @param clientId
 * @param clientSecret
 * @returns {Promise<undefined>}
 */
const getClient = (clientId, clientSecret) => {
  console.tag(tag).debug('getClient-function called');
  console
    .tag(tag)
    .debug(` Used clientId: ${clientId} with secret ${clientSecret}`);
  // Checks if there's a clientId with matching clientSecret.
  const client = clients.find(c => c.clientId === clientId);
  return client && client.clientSecret === clientSecret ? client : undefined;
};

/**
 * oAuth2 saveToken function
 * Gets called by oauth-server module to store the generated token in db.
 * @param token
 * @param client
 * @param user
 * @returns {Promise<*>}
 */
const saveToken = async (token, client, user) => {
  console.tag(tag).debug('saveToken-function called');

  const savingToken = lodash.cloneDeep(token);
  savingToken.user = user._id;
  savingToken.client = client.clientId;

  savingToken.refreshTokenExpiresAt.setDate(
    savingToken.refreshTokenExpiresAt.getDate() + 7
  );

  await TokenModel.create(savingToken);

  const returnToken = lodash.cloneDeep(savingToken);
  returnToken.user = user;
  returnToken.client = client;

  console.debug(`Token: ${returnToken}`);
  return returnToken;
};

/**
 * oAuth2 getAccessToken function
 * Gets called by oauth-server to find access token in db.
 * Is used during checkAuthentication-flow in middleware
 * @param accessToken
 * @returns {Promise<void>}
 */
const getAccessToken = async accessToken => {
  console.tag(tag).debug('getAccessToken called');
  const t = await TokenModel.findOne({ accessToken })
    .populate('user')
    .exec();

  if (!t) return undefined;

  const token = lodash.cloneDeep(t);
  token.client = clients.find(c => c.clientId === t.client);
  token.client.clientSecret = undefined;
  token.user.password = undefined;

  return token;
};

/**
 * oAuth2 getRefreshToken function
 * Gets called by oauth-server (only refresh-token grant type)
 * @param refreshToken
 * @returns {Promise<void>}
 */
const getRefreshToken = async refreshToken => {
  console.tag(tag).debug('getRefreshToken called');

  // Check if this refresh token exists.
  const t = await TokenModel.findOne({ refreshToken })
    .populate('user')
    .exec();

  if (!t) return undefined;

  const token = lodash.cloneDeep(t);
  token.client = clients.find(c => c.clientId === t.client);
  token.client.clientSecret = undefined;
  token.user.password = undefined;

  return token;
};

/**
 * oAuth2 revokeToken function
 * Used to revoke a valid access token.
 * @param token
 * @returns {Promise<boolean>}
 */
const revokeToken = async token => {
  console.tag(tag).debug('RevokeToken called');

  const removedToken = await TokenModel.findOneAndDelete({
    refreshToken: token.refreshToken,
  }).exec();

  return !!removedToken;
};

module.exports = {
  getUser,
  getClient,
  saveToken,
  getAccessToken,
  getRefreshToken,
  revokeToken,
};
