## Contents

The `@grailbio/lib` module holds both utility functions and constants used across GRAIL applications.

## Contributing

This is an open source package. Initial approval by SMEs in https://phabricator.grailbio.com/T26323

All content must be non-proprietary. For example:

- Do not include GRAIL assets, like GRAIL Logo, or commercially sourced images.
- Do not include content that has trade secrets or anything that should remain internal to GRAIL.

Also, all content must be compatible with the contents of the Apache 2.0 license, as defined in `LICENSE` file.

For common private GRAIL code, use `@grail/common-private` or other internal locations.

Modify CHANGELOG.md to reflect contributions to this code.

#### **Production Code Criteria**

- Unit tests.
  - At least 25% line coverage.

When introducing new code, you must include an `index.js`, which exports to the
`index.js` of the `src` directory.

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
- `yarn version --patch --no-git-tag-version`
- For non-patch release, update `CHANGELOG.md` version.
- `npm publish`
  - Optionally, you can pass in 2FA code using `--otp ######`

#### **Installation and Usage**

- If using NPM packages: `yarn add @grailbio/lib`
