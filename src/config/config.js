const env = require('dotenv').config();

module.exports = {
  MONGO_URI: env.parsed.MONGO_URI,
  JWT_EXPIRES_IN: env.parsed.JWT_EXPIRES_IN,
  JWT_SECRET: env.parsed.JWT_SECRET,
  REFRESH_TOKEN_SECRET: env.parsed.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: env.parsed.REFRESH_TOKEN_EXPIRES_IN
};
