// @flow
const jestConfig = require("kcd-scripts/config").jest;

module.exports = Object.assign(jestConfig, {
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/index.js",
    "!**/mocks/**",
    "!src/constants/**",
    "!src/passport/**",
  ],
  coverageThreshold: {
    "src/**/*.js": {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: -10,
    },
  },
});
