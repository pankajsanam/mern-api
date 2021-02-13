module.exports = {
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 94.61,
      branches: 85.98,
      functions: 92.11,
      lines: 94.44
    }
  },
  restoreMocks: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  testRegex: '((\\.|/*.)(test))\\.js?$'
};
