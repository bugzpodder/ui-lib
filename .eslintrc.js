module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  extends: [
    "@grailbio/eslint-config-grail/src/back-end",
    "@grailbio/eslint-config-grail/src/flow"
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
            name: "@grailbio/components",
            message:
              "Please do not import @grailbio/components from @grailbio/lib."
          },
          {
            name: "@grailbio/server-lib",
            message:
              "Please do not import @grailbio/server-lib from @grailbio/lib."
          }
        ],
        patterns: [
          "@grailbio/lib/src/*",
          "@grailbio/server-lib/src/*",
          "@grailbio/components/*"
        ]
      }
    ]
  }
};
