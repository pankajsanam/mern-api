const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./user/middlewares/passport');
const { authLimiter } = require('./user/middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('./user/middlewares/error');
const { NotFoundError } = require('./utils/errors');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/auth', authLimiter);
}

// api routes
app.use('/api', require('./router'));

// Serve public folder as static so we can access images
app.use(express.static('public'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new NotFoundError());
});

// convert error to custom BaseError
app.use(errorConverter);

// handle errors
app.use(errorHandler);

module.exports = app;
