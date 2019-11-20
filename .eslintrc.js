module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "@grailbio/eslint-config-grail/src/back-end",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["import", "filenames", "@typescript-eslint"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message:
              'Please import lodash functions directly, eg: import isEmpty from "lodash/isEmpty".',
          },
          {
            name: "@grailbio/components",
            message:
              "Please do not import @grailbio/components from @grailbio/lib.",
          },
          {
            name: "@grailbio/server-lib",
            message:
              "Please do not import @grailbio/server-lib from @grailbio/lib.",
          },
          {
            name: "date-fns",
            message:
              'Please import date-fns directly, eg: import parseISO from "date-fns/parseISO".',
          },
        ],
        patterns: [
          "@grailbio/lib/src/*",
          "@grailbio/server-lib/src/*",
          "@grailbio/components/*",
        ],
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["src/**/*.spec.ts", "src/**/*.spec.tsx"] },
    ],
    "import/no-unresolved": 0,
  },
};
