const htmlWrapper = require('../utilities/htmlWrapper');

module.exports = (email, givenName, link) => ({
  to: email,
  subject: `Welcome at GatsbyX ${givenName}`,
  text: 'Text version of email body',
  html: htmlWrapper(`
      <h1>Welcome at GatsbyX</h1>
      <p>Hi ${givenName},</p>
      <p>
        Thanks so much for joining us!
      </p>
      <p><b>GatsbyX</b></p>
      <p>
        GatsbyX is a my personal playground for design ideas and also a Gatsby skeleton application.
      </p>
      <p>
       Why don't you come visit us soon again at <a href="${link}"> ${' GatsbyX'}</a>.
      </p>
      <p>
        Best
        <br />
        <i>Your GatsbyX team</i>
      </p>
    `),
});
