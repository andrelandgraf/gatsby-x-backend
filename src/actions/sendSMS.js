const twilio = require('twilio');

const { ENV } = require('../enums');

const client = twilio(ENV.TWILIO_SID, ENV.TWILIO_SECRET);

const tag = 'actions/sendSMS.js';
const from = ENV.TWILIO_NUMBER;

module.exports = async ({ to, text }) => {
  if (!ENV.SEND_SMS_ENABLED) {
    console.tag(tag).info('sending sms disabled');
    return;
  }
  try {
    console.tag(tag).verbose('sending sms...');
    await client.messages.create({
      body: text,
      from,
      to,
    });
    console.tag(tag).verbose('sent email!');
  } catch (error) {
    console.tag(tag).error(error.message);
  }
};
