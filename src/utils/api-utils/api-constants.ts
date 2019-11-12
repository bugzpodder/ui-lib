export const ENCODED_DOUBLE_AMPERSAND = global.encodeURIComponent("&&");
export const ENCODED_DOUBLE_PIPE = global.encodeURIComponent("||");
export const ENCODED_PERCENT_CHAR = global.encodeURIComponent("%"); // This provides the LIKE query option.

export const STRING_START_CHAR = "^";
export const STRING_END_CHAR = "$";
export const ENCODED_STRING_START_CHAR = global.encodeURIComponent(
  STRING_START_CHAR,
);
export const ENCODED_STRING_END_CHAR = global.encodeURIComponent(
  STRING_END_CHAR,
);
export const ENCODED_QUOTE_CHAR = global.encodeURIComponent('"');
export const ENCODED_EQUAL_CHAR = global.encodeURIComponent("=");

export const OMNI_TEXT_SEARCH_TYPE = Symbol("omni-text");
export const LIKE_TEXT_SEARCH_TYPE = Symbol("like-text");
export const NUMERIC_SEARCH_TYPE = Symbol("numeric");
export const BOOLEAN_SEARCH_TYPE = Symbol("boolean");
export const ENUM_SEARCH_TYPE = Symbol("enum-key");
export const FULL_TEXT_SEARCH_TYPE = Symbol("full-text");
export const DATE_SEARCH_TYPE = Symbol("date");
export const DATETIME_SEARCH_TYPE = Symbol("datetime");
export const FULL_ID_SEARCH_TYPE = Symbol("full-id");
export const LIKE_ID_SEARCH_TYPE = Symbol("like-id");

export const URI_QUERY_TYPE = Symbol("uri-query");

export const DATE_SEARCH_TYPES = [DATE_SEARCH_TYPE, DATETIME_SEARCH_TYPE];
