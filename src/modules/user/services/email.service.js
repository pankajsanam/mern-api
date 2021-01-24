const nodeMailer = require('nodemailer');
const config = require('../../../config/config');
const logger = require('../../../config/logger');

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

  const resetPasswordUrl = `${config.webUrl}/reset-password?token=${token}`;
  const text = `Hi,

  Click on the following link to reset your password:

  ${resetPasswordUrl}

  Mint Team`;

  await sendEmail(to, subject, text);
};

/**
 * Send an email on user registration
 *
 * @param to
 * @returns {Promise<void>}
 */
const sendWelcomeEmail = async to => {
  const subject = 'Thanks for signing up';
  const url = `${config.webUrl}/login`;

  const text = `Hey,

  Thanks for signing up. Your account has been created.

  Click on the below link to login:

  ${url}

  Mint Team`;

  await sendEmail(to, subject, text);
};

module.exports = {
  sendResetPasswordEmail,
  sendWelcomeEmail,
  transport,
  sendEmail
};
