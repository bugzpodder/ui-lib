## Contents

The `@grail/lib` module holds both utility functions and constants used across GRAIL applications.

## Contributing

This project is open sourced. All content must be non-proprietary. For example:

- Do not include GRAIL assets, like GRAIL Logo, or commercially sourced images.
- Do not include content that has trade secrets or anything that should remain internal to GRAIL.

For common private GRAIL code, use `@grail/common-private` or other internal locations.

Modify CHANGELOG.md to reflect contributions to this code.

#### **Production Code Criteria**

- Unit tests.
  - At least 25% line coverage.

When introducing new code, you must include an `index.js`, which exports to the
`index.js` of the `src` directory.

Include `flow-typed` files as needed and categorized between ones
written for npm packages, and ones written for GRAIL's custom utility functions.

### Distributing to GitHub

URL: https://github.com/grailbio/ui-lib

Once code is merged into GRAIL repo - `master` branch, replicate the commit to github.

TODO: Document how to use `grit`, or refer to how it automatically pushes to github using
`$GRAIL/phabricator/shipit/sync.bash`

### Publishing to NPM

URL: https://www.npmjs.com/package/@grailbio/lib

You will need to be a member:
https://www.npmjs.com/settings/grailbio/members

Recommend turning on 2FA.

To publish:

- Bump the package version following semantic versioning guidelines (https://semver.org/)
- For non-patch release, update `CHANGELOG.md` version.
- `npm publish --access public`
  - Optionally, you can pass in 2FA code using `--otp ######`
