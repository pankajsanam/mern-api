module.exports = {
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 95.49,
      branches: 87.62,
      functions: 93.42,
      lines: 95.35
    }
  },
  restoreMocks: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  testRegex: '((\\.|/*.)(test))\\.js?$'
};
