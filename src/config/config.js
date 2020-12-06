const env = require('dotenv');
const path = require('path');
const joi = require('@hapi/joi');

env.config({
  path: path.join(__dirname, '../../.env')
});

const configSet = joi.object()
  .keys({
    WEB_URL: joi.string(),
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(3000),
    MONGODB_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRY_MINUTES: joi.number().default(3),
    JWT_REFRESH_TOKEN_EXPIRY_DAYS: joi.number().default(30),
    RESET_PASSWORD_TOKEN_EXPIRY_MINUTES: joi.number().default(10),
    SMTP_HOST: joi.string().allow(null, ''),
    SMTP_PORT: joi.number(),
    SMTP_USERNAME: joi.string().allow(null, ''),
    SMTP_PASSWORD: joi.string().allow(null, ''),
    EMAIL_FROM: joi.string().allow(null, '')
  })
  .unknown();

const { value: configValue, error } = configSet
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: configValue.NODE_ENV,
  webUrl: configValue.WEB_URL,
  port: configValue.PORT,
  mongoose: {
    url: configValue.MONGODB_URL + (configValue.NODE_ENV === 'test' ? '_test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: configValue.JWT_SECRET,
    accessExpirationMinutes: configValue.JWT_ACCESS_TOKEN_EXPIRY_MINUTES,
    refreshExpirationDays: configValue.JWT_REFRESH_TOKEN_EXPIRY_DAYS,
    resetPasswordExpirationMinutes: configValue.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES
  },
  email: {
    smtp: {
      host: configValue.SMTP_HOST,
      port: configValue.SMTP_PORT,
      auth: {
        user: configValue.SMTP_USERNAME,
        pass: configValue.SMTP_PASSWORD
      }
    },
    from: configValue.EMAIL_FROM
  }
};
