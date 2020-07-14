# MINT EXPRESS 0.3.0

<p align="center">
    <img alt="Mint logo" src="https://i.imgur.com/OuDAqB1.png" width="200px" />
</p>

[![Build Status](https://travis-ci.com/pankajsanam/mint-express.svg?branch=master)](https://travis-ci.com/pankajsanam/mint-express)
[![Coverage Status](https://coveralls.io/repos/github/pankajsanam/mint-express/badge.svg?branch=master)](https://coveralls.io/github/pankajsanam/mint-express?branch=master)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Support via Paypal](https://img.shields.io/badge/support-paypal-yellowgreen.svg?style=flat-square)](https://paypal.me/pankajsanam)

A starter kit for building modular RESTful APIs using Node, Express, and Mongoose.

Quickly start your project with all the essential features required to build a REST API.

## Features

- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- Authentication and authorization using [passport](http://www.passportjs.org)
- Linting with [eslint](http://eslint.org) + Airbnb linting rules
- Unit and integration tests using [Jest](https://jestjs.io)
- Environment variables using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- Advanced production process management and monitoring using [PM2](https://pm2.keymetrics.io)
- Git hooks with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- Cross-Origin Resource-Sharing (CORS) enabled using [cors](https://github.com/expressjs/cors)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Logging using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- Set security HTTP headers using [helmet](https://helmetjs.github.io)
- Request data validation using [Joi](https://github.com/hapijs/joi)
- Continuous integration with [Travis CI](https://travis-ci.org)
- Sanitize request data against xss and query injection
- Consistent editor configuration using [EditorConfig](https://editorconfig.org)
- Code coverage using [coveralls](https://coveralls.io)
- Centralized error handling
- Docker support
- Pagination plugin for mongoose
- Roles and permissions

## Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/pankajsanam/mint-express.git
cd mint-express
rm -rf .git
```

Install the dependencies:

```bash
npm i
```

Create a config file for setting environment variables and setup your tokens:

```bash
cp .env.example .env
```

### Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run start
```

Testing:

```bash
# run all tests
npm test

# run all tests in watch mode
npm test:watch

# run test coverage
npm run coverage
```

Docker:

```bash
# run docker container in development mode
npm run docker:dev

# run docker container in production mode
npm run docker:prod

# run all tests in a docker container
npm run docker:test
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm lint:fix
```

## Project Structure

```
src\
 |--config\           # Environment variables and configuration related things
 |--modules\          # All the module related files
  |--user\            # User module
   |--controllers\    # User module controllers
   |--middlewares\    # User module middlewares
   |--models\         # Mongoose models for User module
   |--routes\         # Routes for user module
   |--services\       # Business logic for user module
   |--tests\          # User module specific tests
   |--validations\    # Request data validation schemas for user module
 |--utils\            # Utility classes and functions
 |--app.js            # Express app
 |--index.js          # App entry point
 |--router.js         # Entry point for all module routes
```

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/auth/register` - register\
`POST /api/auth/login` - login\
`POST /api/auth/refresh-tokens` - refresh auth tokens\
`POST /api/auth/forgot-password` - send reset password email\
`POST /api/auth/reset-password` - reset password

**User routes**:\
`POST /api/user` - create a user\
`GET /api/user` - get all paginated users\
`GET /api/user/:userId` - get user\
`PATCH /api/user/:userId` - update user\
`DELETE /api/user/:userId` - delete user

## Logging

Import the logger from `src/utils/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending 
order from most important to least important):

```javascript
const logger = require('<path to src>/utils/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\

API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

### Pagination

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `User` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => User.paginate(filter, options);
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc',
  limit: 5,
  page: 2,
};
```

## Logs

```bash
pm2 logs
```

## Linting

Linting is done using [ESLint](https://eslint.org/)

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications.

To modify the ESLint configuration, update the `.eslintrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Author

Pankaj Sanam - [@pankajsanam](https://twitter.com/pankajsanam)

## Support Me

<a href="https://www.buymeacoffee.com/pankajsanam" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 25px !important;width: 50px !important;"></a>


## License

[MIT License](LICENSE)
