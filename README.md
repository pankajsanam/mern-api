# MERN API Boilerplate

A simple boilerplate for your Node Express APIs.

## Features

- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- Linting with [eslint](http://eslint.org) + Airbnb linting rules
- Tests with [jest](https://jestjs.io/)
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Monitoring with [pm2](https://github.com/Unitech/pm2)
- Git hooks with [husky](https://github.com/typicode/husky)
- Logging with [winston](https://github.com/winstonjs/winston)
- Authentication with [express-jwt](https://github.com/auth0/express-jwt)

## APIs

Following APIs are available with this setup-

    POST - /api/login - Login with the credentials
    POST - /api/register - Create a new user
    GET - /api/users - List of all users

## Getting Started

#### Clone the repo

```bash
git clone https://github.com/pankajsanam/mern-api
cd mern-api
rm -rf .git
```

#### Install dependencies:

```bash
npm i
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running the server

```bash
npm run start
```

## Lint

```bash
# lint code with ESLint
npm run lint

# try to fix ESLint errors
npm run lint:fix

# lint and watch for changes
npm run lint:watch
```

## Test

```bash
# run all tests with Jest
npm run test

# run unit tests
npm run test:unit

# run integration tests
npm run test:integration

# run all tests and watch for changes
npm run test:watch

# open nyc test coverage reports
npm run coverage
```

## Logs

```bash
pm2 logs
```

## License

[MIT License](LICENSE)
