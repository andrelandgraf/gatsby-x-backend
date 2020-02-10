const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const OAuth2Server = require('oauth2-server');
const cors = require('cors');
const mongoose = require('mongoose');

require('./config');
const { ENV } = require('./src/enums');
const oauthModel = require('./src/middlewares/oauth');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const itemRoutes = require('./src/routes/item');
const purchaseRoutes = require('./src/routes/purchase');

console.tag().info(`Branch: ${process.env.BRANCH}`);
console.tag().info(`Environment: ${ENV.NODE_ENV}`);

const app = express();

// helmet first
app.use(helmet());
app.use(cors());
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      if (req.path === '/purchases/stripe/webhook') {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// configure OAuth2
app.oauth = new OAuth2Server({
  model: oauthModel,
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true,
});

// route config
app.get('/', (req, res) =>
  res.send('Hey kiddo, this is a REST endpoint. Thanks for checking by')
);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/purchases', purchaseRoutes);

// config mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

/**
 * Start of application
 * 1. open db connection
 * 2. initialize manual caching of large collections
 * 3. start web server process
 */
mongoose
  .connect(ENV.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(ENV.PORT, () =>
      console.tag().info(`Express backend listening on port ${ENV.PORT}!`)
    );
  });
