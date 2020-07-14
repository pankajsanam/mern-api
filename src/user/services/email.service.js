const nodeMailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');

const transport = nodeMailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server.'));
}

/**
 * Send an email
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: config.email.from, to, subject, text
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 *
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';

  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.webUrl}/reset-password?token=${token}`;
  const text = `Hey there!,

  Click on the following link to reset your password:

  ${resetPasswordUrl}

  Thanks`;

  await sendEmail(to, subject, text);
};

module.exports = {
  sendResetPasswordEmail,
  transport,
  sendEmail
};
