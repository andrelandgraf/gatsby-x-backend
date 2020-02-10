/**
 * UserController
 * handles all user related requests.
 */
const bcrypt = require('bcrypt');

const { ENV, ERROR_TYPES } = require('../enums');
const { sendEmail, sendSlack, formatEmail } = require('../actions');
const { buildWelcomeTemplate } = require('../templates');
const UserModel = require('../models/user');

const tag = 'controllers/user.js';

const changePassword = async (req, res) => {
  console.tag(tag).info('change password user called');
  const { password } = req.body;
  const {
    user: { _id },
  } = req.body.token;

  if (!password) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'missing password property in req body',
      type: ERROR_TYPES.badRequest,
    });
  }

  return UserModel.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(password, 8),
  }).then(() =>
    res.status(200).json({ message: 'password updated successfully' })
  );
};

const register = async (req, res) => {
  console.tag(tag).info('register user called');
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'No user passed in body',
      type: ERROR_TYPES.badRequest,
    });
  }

  const { email: unformattedEmail, password, givenName, familyName } = user;

  if (!unformattedEmail || !password || !givenName || !familyName) {
    return res.status(400).json({
      error: 'BadRequest',
      message:
        'missing email, password, givenName or familyName property in req body',
      type: ERROR_TYPES.badRequest,
    });
  }

  const email = formatEmail(unformattedEmail);
  const existingUser = await UserModel.findOne({ email }).exec();
  if (existingUser) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'user with email address already exists',
      type: ERROR_TYPES.emailTaken,
    });
  }

  const registeringUser = {
    email,
    password: bcrypt.hashSync(password, 8),
    givenName: givenName.trim(),
    familyName: familyName.trim(),
  };
  const link = ENV.GATSBYX_DOMAIN;
  const template = buildWelcomeTemplate(
    registeringUser.email,
    registeringUser.givenName,
    link
  );
  sendEmail(template);
  sendSlack('Yaaaayy, a new user registered!');
  return UserModel.create(registeringUser).then(savedUser =>
    res.status(200).json(savedUser)
  );
};

const getMe = (req, res) => {
  console.tag(tag).info('get user me called');
  const { user } = req.body.token;
  return res.status(200).json(user);
};

const getUsers = (req, res) => {
  console.tag(tag).info('get users called');
  return UserModel.find({})
    .select('-password')
    .then(users => res.status(200).json(users));
};

module.exports = {
  register,
  changePassword,
  getMe,
  getUsers,
};
