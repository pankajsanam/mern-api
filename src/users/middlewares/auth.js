const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const auth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    let token = '';

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;

        jwt.verify(token, config.JWT_SECRET, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
          next();

          return true;
        });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = auth;
