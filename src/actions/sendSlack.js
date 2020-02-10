const fetch = require('node-fetch');

const { ENV } = require('../enums');

const tag = 'actions/sendSlack.js';

module.exports = async message => {
  if (!ENV.SEND_SLACK_ENABLED) {
    console.tag(tag).info('sending slack disabled');
    return;
  }
  try {
    console.tag(tag).verbose('sending slack...');
    await fetch(ENV.SLACK_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
    console.tag(tag).verbose('slack sent!');
  } catch (error) {
    console.tag(tag).error(error.message);
  }
};
