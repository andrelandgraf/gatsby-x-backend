/**
 * AuthController
 * handles all auth related request of api.
 */
const { Request, Response } = require('oauth2-server');
const { createHash, randomBytes } = require('crypto');
const { promisify } = require('util');

const awaitRandomBytes = promisify(randomBytes);

const { ENV, ERROR_TYPES } = require('../enums');
const { buildResetPasswordTemplate } = require('../templates');
const UserModel = require('../models/user');
const TokenModel = require('../models/token');
const { sendEmail, formatEmail } = require('../actions');

const tag = 'controllers/auth.js';

/**
 * retrieved from our oauth2-server
 * https://github.com/oauthjs/node-oauth2-server/blob/master/lib/utils/token-util.js
 */
const generateRandomToken = () =>
  awaitRandomBytes(256).then(buf =>
    createHash('sha1')
      .update(buf)
      .digest('hex')
  );

/**
 * Method to handle access token requests.
 * @param req
 * @param res
 * @returns {Promise<T>}
 */
const obtainToken = async (req, res) => {
  console.tag(tag).info('obtainToken called');

  if (req.body.grant_type === 'password' && !req.body.password) {
    console.tag(tag).error('no password found in body');
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no password in req body',
      type: ERROR_TYPES.wrongCredentials,
    });
  }

  if (req.body.grant_type === 'password') {
    req.body.username = formatEmail(req.body.username);
  }

  try {
    const request = new Request(req);
    const response = new Response(res);
    const token = await req.app.oauth.token(request, response);
    const returnToClient = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      // password have been removed already
      user: token.user,
    };
    return res.status(200).json(returnToClient);
  } catch (err) {
    console.tag(tag).warn(`${err.name}: ${err.message}`);
    return res.status(401).json({
      error: err.name,
      message: err.message,
      type:
        err.name === 'invalid_grant'
          ? ERROR_TYPES.wrongCredentials
          : ERROR_TYPES.sessionExpired,
    });
  }
};

/**
 * Method to handle access token requests.
 * @param req
 * @param res
 * @returns {Promise<T>}
 */
const resetPwToken = async (req, res) => {
  console.tag(tag).info('getChangePwToken called');

  const { email: unformattedEmail } = req.body;
  if (!unformattedEmail) {
    console.tag(tag).error('bad request, no email provided');
    return res.status(400).json({
      error: 'BadRequest',
      message: 'no email provided',
      type: ERROR_TYPES.wrongCredentials,
    });
  }

  const email = formatEmail(unformattedEmail);
  const user = await UserModel.findOne({ email });
  if (!user) {
    console.tag(tag).error(`could not find user with email ${email}`);
    return res.status(404).json({
      error: 'BadRequest',
      message: `could not find user for email ${email}`,
      type: ERROR_TYPES.userNotFound,
    });
  }

  const accessToken = await generateRandomToken();
  const refreshToken = await generateRandomToken();
  new TokenModel({
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: new Date().setDate(new Date().getDate() + 1), // 24h
    accessTokenExpiresAt: new Date().setDate(new Date().getDate() + 1), // 24h
    client: 'gatsbyx',
    user: user._id,
  }).save();

  const resetLink = `${ENV.GATSBYX_DOMAIN}/password?token=${accessToken}`;
  sendEmail(buildResetPasswordTemplate(user.email, resetLink));
  return res
    .status(200)
    .json({ message: 'successfully sent email to reset password' });
};

module.exports = {
  obtainToken,
  resetPwToken,
};
