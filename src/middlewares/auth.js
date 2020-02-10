const { Request, Response } = require('oauth2-server');

const tag = 'middlewares/auth.js';

/**
 * Checks if the token in request is valid.
 * throws if it is invalid.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<T>}
 */
const checkAuthentication = (req, res, next) => {
  console.tag(tag).info('checkAuthentication called');
  console
    .tag(tag)
    .debug(`checking authentication for token: ${JSON.stringify(req.headers)}`);

  const request = new Request(req);
  const response = new Response(res);

  return req.app.oauth
    .authenticate(request, response)
    .then(token => {
      req.body.token = token;
      return next();
    })
    .catch(err => res.status(err.code || 500).json(err));
};

module.exports = { checkAuthentication };
