const htmlWrapper = require('../utilities/htmlWrapper');

module.exports = (email, resetLink) => ({
  to: email,
  subject: 'Reset Password',
  text: `No problem, follow this link to reset your password: ${resetLink}`,
  html: htmlWrapper(`
    <h1>GatsbyX</h1>
    <h2>Reset Password</h2>
    <p>
      You forgot your password? No problem! Follow the link below to the gatsbyX website
      and set a new password now!
    </p> 
    <p>Please be aware that this link stays active for <i>24</i> hours only.</p>
    <p><b>Reset now:</b> ${resetLink}</p>
    <p>
      Best
      <br />
      <i>Your GatsbyX team</i>
    </p>
  `),
});
