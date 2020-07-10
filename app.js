const express = require('express');
const cors = require('cors');
const jwt = require('./src/users/middlewares/jwt');
const router = require('./src/router.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(jwt());

app.use('/api', router);

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.send({
    error: 'Not found'
  });
});

// Error handler for development environment which will print the full stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
      .send({
        message: err.message,
        error: err
      });
  });
}

// Error handler for production without any error stacktrace
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

module.exports = app;
