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
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
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
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
  },
};
