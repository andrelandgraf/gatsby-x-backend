<h1 align="center">
  Express Skeleton Backend - GatsbyX
</h1>
<h2 align="center">
  <a href="https://demo.andre-landgraf.cool/">
    👉 Live Demo
  </a>
</h2>

Kick off your project with this boilerplate. This starter configures my tech stack of choice based on Node and Express with MongoDB implementation to get up and running in no time. There is also a corresponding frontend! Find the gatsby-x frontend [here](https://github.com/andrelandgraf/gatsby-x).

## 🚀 Quick start

**Clone this repository.**

Navigate into your new site’s directory and create an enviorment file for your secrets management.

```shell
cd gatsby-x-backend/
touch .env
```
**Insert your secrets.**

Required secrets:

- PORT
- MONGODB_URI
- GATSBYX_DOMAIN
- GATSBYX_SECRET

```
PORT=8888
LOG_LEVEL=[error|warn|info|http|verbose|debug]
MONGODB_URI=#uri to your database
GATSBYX_DOMAIN=http://localhost:8000 #change to prod url on your prod .env
MEDIA_PATH=#an url to your hosted assets e.g. pdfs etc (remove any / at the end of the url!)
GATSBYX_SECRET=oauthSecret #make sure you safe the same secret in your frontend
STRIPE_SECRET=#your stripe API key
STRIPE_WEBHOOK_SECRET=#your stripe webhook secret
SENDGRID_SECRET=#your sendgrid API key
TWILIO_SECRET=#your twilio API key
TWILIO_SID=#your twilio SID
TWILIO_NUMBER=#your twilio phone number
SEND_SMS_ENABLED=[false|true]
SEND_SLACK_ENABLED=[false|true]
SEND_EMAIL_ENABLED=[false|true]
SLACK_WEBHOOK=#your slack webhook to post any error messages or reports
SENDGRID_EMAIL=#your email address for sendgrid email sending
```

**Run the server locally!**

```shell
npm run start
```

## 🧐 What's inside

**Following features ship with this skeleton:**

- Express.js with state-of-the-art middlewares configured
- Mongoose
- Level based logging with Winston and Slack error transport
- Stripe checkout API webhook endpoint
- Email sending with Sendgrid
- SMS sending with Twilio
- Slack notifications / event logging
- No-Sweat™ Eslint and Prettier by Wes Bos
- OAuth2 auth flow with login/signup and password encription via bcrypt

For more information visit the [landing page](https://demo.andre-landgraf.cool/) of this project.

## 💫 Deploy

[![Deploy with Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## 🖼 The frontend

Please find the skeleton frontend for this backend here: https://github.com/andrelandgraf/gatsby-x
