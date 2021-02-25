const mongoose = require('mongoose');
const config = require('../config');

const setupTestDB = () => {
  // eslint-disable-next-line jest/no-hooks,jest/require-top-level-describe
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
  });

  // eslint-disable-next-line jest/no-hooks,jest/require-top-level-describe
  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async collection => collection.deleteMany()));
  });

  // eslint-disable-next-line jest/no-hooks,jest/require-top-level-describe
  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
