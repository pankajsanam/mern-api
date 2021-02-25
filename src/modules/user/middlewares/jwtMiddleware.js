const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../../../config');
const User = require('../models/user.model');
const Token = require('../models/token.model');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
  const user = await User.findById(payload.sub);
  const userTokens = await Token.find({ user: payload.sub, blacklisted: false });

  if (!user || !userTokens.length) {
    return done(null, false);
  }

  done(null, user);
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy
};
