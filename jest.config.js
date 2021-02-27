module.exports = {
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 97.97,
      branches: 93.33,
      functions: 96.05,
      lines: 97.91
    }
  },
  restoreMocks: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  testRegex: '((\\.|/*.)(test))\\.js?$'
};
