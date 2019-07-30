// @flow

export const percentChar = "%25"; // %25 is `%`. This provides the LIKE query option.
export const doubleAmpersand = "%26%26"; // %26%26 is `&&`.
export const doublePipe = "||";

export const LIKE_TEXT_SEARCH_TYPE = Symbol("like-text");
export const NUMERIC_SEARCH_TYPE = Symbol("numeric");
export const BOOLEAN_SEARCH_TYPE = Symbol("boolean");
export const FULL_TEXT_SEARCH_TYPE = Symbol("full-text");
export const MULTI_FIELD_TEXT_SEARCH_TYPE = Symbol("multi-field-text-search");
export const DATE_SEARCH_TYPE = Symbol("date");
export const DATETIME_SEARCH_TYPE = Symbol("datetime");
export const FULL_ID_SEARCH_TYPE = Symbol("full-id");
export const LIKE_ID_SEARCH_TYPE = Symbol("like-id");

export const DATE_SEARCH_TYPES = [DATE_SEARCH_TYPE, DATETIME_SEARCH_TYPE];
