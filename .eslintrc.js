module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  extends: [
    "@grail/eslint-config-grail/src/back-end",
    "@grail/eslint-config-grail/src/flow"
  ],
  plugins: ["flowtype", "import", "filenames"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message:
              'Please import lodash functions directly, eg: import isEmpty from "lodash/isEmpty".'
          },
          {
            name: "@grail/components",
            message: "Please do not import @grail/components from @grail/lib."
          },
          {
            name: "@grail/server-lib",
            message: "Please do not import @grail/server-lib from @grail/lib."
          }
        ],
        patterns: [
          "@grail/lib/src/*",
          "@grail/server-lib/src/*",
          "@grail/components/*"
        ]
      }
    ]
  }
};
