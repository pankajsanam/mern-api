const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../../config/config');
const User = require('../models/user.model');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
  const user = await User.findById(payload.sub);

  if (!user) {
    return done(null, false);
  }

  done(null, user);
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy
};
