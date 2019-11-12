module.exports = {
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/index.ts",
    "!**/mocks/**",
    "!src/constants/**",
    "!src/passport/**",
    "!src/api/**",
    "!src/utils/warning-utils/**",
  ],
  coverageThreshold: {
    "src/**/*.ts": {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: -10,
    },
  },
};
