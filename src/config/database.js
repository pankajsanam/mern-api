const mongoose = require('mongoose');
const config = require('./config');

const mongoParams = {
  autoIndex: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

mongoose.connect(config.MONGO_URI, mongoParams, (err, client) => {
  if (err) {
    console.error(err);
    console.log(client);
  }
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('connected', () => {
  console.log('> connected to mongodb');
});

db.once('open', () => {
  console.log('> opened the database');
});

db.on('error', () => {
  console.log('> error from the database');
});

module.exports = mongoose;
