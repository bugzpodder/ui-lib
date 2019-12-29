## 2.0.0

1. (BREAKING) Deprecated legacy type definitions.
2. (BREAKING) sentenceCase no longer uses a default keyword map.

## 1.1.0 - 2019-##-

1. Add `ZERO_DATE` constant. This is used to check for zero dates returned by go servers.
2. `formatDate` and `formatDateTime` no longer return `EPOCH_DATE`s when empty strings are passed.
3. Add `Api` class, originally from `lims/client`.
4. Remove `search` method from `Api`. It should be implemented by the client app.
5. Fix flow problems with exporting `Api` class types.
6. Add URI_QUERY_TYPE to searchOptions.
7. Replaced buildSearchQuery, buildOrderQuery with buildQuery.
8. Move sidebar-content and related URL constants to `common-private`.
9. Rename package to `@grailbio/lib`, publish to github and npm.
10. filterResults uses default values if they aren't provided.
11. filterResults can now filter and sort deeply nested objects.
12. filterResults sort string values in proper numeric order.
13. Stop suppressing unauthorized errors from being displayed.
14. Add support for date-fns in date utils.

## 1.0.0 - 2019-06-17

1. Include all dash-looking characters when sanitizing ids in `id-util.js`
2. Remove hard-coded blacklist in camelizeObjectKeys and titlizeObjectKeys.
3. Add grid util functions: `getColHeader`, `getRowHeader`, and `getGridCellPosition`.
4. Add type `mapValuesDispatcher` function to allow coders the option of dispatching
   value mapper in Omni Search fields.
5. Move node server lib code like `passport` utils and `commandLine` utils to `@grail/server-lib`.
6. Add `grailPurpleActionColor`. (Intended for links and actions).
7. sanitizeId only removes the dash in the second last position instead of every position.

## 0.10.0 - 2019-04-01

1. Refactor to use new Api search types like `SearchOptionsV2`. See D24185
2. Mark old `SearchOption` types as Deprecated or Old.
3. Deprecated `MULTI_FIELD_TEXT_SEARCH_TYPE` (Use `LIKE_TEXT_SEARCH_TYPE` instead.)
4. Make `searchFields` optional. (Use `name` as a singular `searchField`).
5. Add ability to define `mapValues` function in `searchDefs`.
   This allows conversion from human readable omni text to enums, or string matching.
6. Make `buildSearchQuery` be `async`. All callers need to `await` or similar.
7. Add `valueToSuggestions` and `valuesToSuggestions`
8. Add `toDelimitedReport` and other table utils to convert a table to CSV.
9. Add `toPairWise` array util.

## 0.9.0

1. Add `includeNulls` to query builder and filter builder
2. Allow omni search to search by end date only.
3. Include flow definitions in build.
4. Clean up Flow types.
5. Update sidebar content.
6. Cleanup search API definitions and functionality.
7. Bug fixes.

## 0.8.0 - 2018-11-07

1. Update omni search field and bar:

- localStorage now includes `omni-` prefix.
- Add support for omni commands. This allows `OmniChip` in tables to request changes in `OmniSearchBar`.
- Add support for start and end of string support using `^` and `$`.
- Add support for quoted strings as exact search.
- Update api-utils to encode URI characters correctly.
- Add string utils `unquoteString` and `extractQuotedString`

## 0.7.0 - 2018-10-24

1.  Add support for `OMNI_TEXT_SEARCH_TYPE`.
2.  Update sidebar content
3.  Update API utils and search utils to consolidate search options and allow
    for more flexibility with searching, specifically searching id's with `-`
4.  Improve testing

## 0.6.0 - 2018-08-17

1.  New navigation links for mock samples.
2.  Add formatPercent.

## 0.5.0 - 2018-07-31

1.  Updated navigation links for instruments and analysis versions.

## 0.4.0 - 2018-07-27

1.  Removed formtDate and renamed formatDateOnly to formatDate.

## 0.3.0 - 2018-07-17

1.  Added sanitizeIds getInputBarcode.
2.  Fixed build.

## 0.2.0 - 2018-06-22

1.  Use @babel/plugin-transform-runtime.

## 0.1.0 - 2018-06-20

1.Initial release!
