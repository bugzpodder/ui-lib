// @flow

export const EPOCH_DATE = "1970-01-01";
export const EPOCH_DATE_TIME = "1970-01-01T08:00:00.000Z";
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const ISO8601_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

/**
 * ISO-8601 input masks.
 * TODO: consider providing functions.
 */

// This mask guides the user to enter a date in ISO-8601 format.
// It does not check for erroneous dates like 2018-19-01 or 2018-02-31
export const DATE_INPUT_MASK = [
  // YYYY between 1000 and 9999
  /[1-9]/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  // MM between 00 and 19
  /[0-1]/,
  /\d/,
  "-",
  // DD between 00 and 39
  /[0-3]/,
  /\d/,
];

// This mask guides the user to enter a time in ISO-8601 format.
// It does not check for erroneous times like 29:59:59.
// Note - it does not allow valid times like 23:59:60
export const TIME_INPUT_MASK = [
  // HH between 00 and 29
  /[0-2]/,
  /\d/,
  ":",
  // mm between 00 and 59
  /[0-5]/,
  /\d/,
  ":",
  // SS between 00 and 59
  /[0-5]/,
  /\d/,
];

// This mask guides the user to enter a date-time in ISO-8601 format.
// See caveats above about erroneous dates and times.
export const DATE_TIME_INPUT_MASK = [...DATE_INPUT_MASK, " ", ...TIME_INPUT_MASK];
