// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

const { ENV } = require('../enums');

sgMail.setApiKey(ENV.SENDGRID_SECRET);

const tag = 'actions/sendEmail.js';
const from = ENV.SENDGRID_EMAIL;

module.exports = async ({ to, subject, text, html }) => {
  if (!ENV.SEND_EMAIL_ENABLED) {
    console.tag(tag).info('sending email disabled');
    return;
  }
  try {
    console.tag(tag).verbose('sending email...');
    await sgMail.send({
      to,
      from,
      subject,
      text,
      html,
    });
    console.tag(tag).verbose('sent email!');
  } catch (error) {
    console.tag(tag).error(error.message);
  }
};
