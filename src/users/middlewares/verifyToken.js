const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const config = require('../../config/config');

const verifyToken = (req, res, next) => {
  let token = '';

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      } else {
        return next();
      }
    } else {
      return next();
    }
  }

  if (token) {
    jwt.verify(token, config.JWT_SECRET, err => {
      const decodedToken = jwtDecode(token);

      if (err) {
        // new token
        jwt.sign(
          { sub: decodedToken.sub },
          config.JWT_SECRET,
          { expiresIn: config.JWT_EXPIRES_IN }
        );

        // Here I can check if the received token in the request expired
        if (err.name === 'TokenExpiredError') {
          jwt.sign({ success: true }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
          });

          next();
        } else if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        }
      } else {
        // If no error with the token, continue
        // req.apiToken = token;
        next();
      }

      return false;
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }

  return false;
};

module.exports = verifyToken;
