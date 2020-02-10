const htmlWrapper = require('../utilities/htmlWrapper');

module.exports = (email, givenName, itemName, link) => ({
  to: email,
  subject: `Purchase ${itemName}`,
  text: `Text version of email body`,
  html: htmlWrapper(`
    <h1>Thank you so much for your purchase</h1>
    <p>Hi ${givenName},</p>
    <p>
      Thank you so much for choosing gatsbyX and purchasing ${itemName}.
    </p> 
    <p><b>Please come back and visit us soon again!</b></p>
    <p>
      Here you go:
      <a href="${link}"> ${' Our website'}</a>
      .
    </p>
    <p>
      Best
      <br />
      <i>Your GatsbyX team</i>
    </p>
    `),
});
