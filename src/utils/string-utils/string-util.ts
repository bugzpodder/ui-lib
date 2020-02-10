import { ENCODED_QUOTE_CHAR } from "../api-utils/api-constants";
import { camelCase, startCase } from "lodash";
import { generateFilledArray } from "../array-utils";

export const sentenceCase = (
  string: string,
  keywords: Map<string, string> = new Map(),
): string => {
  string = string || "";
  const sentenceCased = startCase(camelCase(string.trim()));
  const separator = " ";
  return sentenceCased
    .split(separator)
    .map(word => keywords.get(word) || word)
    .join(separator);
};

const charCodeOfA = "A".charCodeAt(0);

export const upperAlphaChars = generateFilledArray(26, (_, index) =>
  String.fromCharCode(charCodeOfA + index),
);

export const normalizeStr = (str: string): string => {
  if (!str) {
    return "";
  }
  return str
    .replace(/[_^\W+]/g, " ")
    .trim()
    .toLowerCase();
};

// replaces underscores, capitalizes letters after underscore, adds space before camelCasing
// my_coolString -> My Cool String
export const makeTitleString = (str: string, capFirst = true): string =>
  str
    .replace(/([a-z])([A-Z])([a-z])/g, "$1 $2$3") // space around camels
    .replace(/_(.)/g, $1 => ` ${$1.toUpperCase()}`) // uppercase after underscore
    .replace(/_/g, " ") // underscore to space
    .replace(/^(.)/, $1 => (capFirst ? $1.toUpperCase() : $1)) // capitalize the first letter (if specified)
    .replace("  ", " ");

/**
 * Formats a float as a percentage, rounding to two decimal points.
 * The number is typically already rounded in the back-end, but we round again
 * because floating-point arithmetic on an already-rounded number might generate
 * a value like 4.32000000000000001.
 * @param value The float to format.
 */
export const formatPercent = (value: any): string => {
  const floatValue = parseFloat(value);
  if (Number.isNaN(floatValue)) {
    return "-";
  }
  return `${(floatValue * 100.0).toFixed(2)}%`;
};

export const isQuotedString = (value: string, quoteChar = '"'): boolean => {
  if (quoteChar === ENCODED_QUOTE_CHAR) {
    value = value.replace(new RegExp(ENCODED_QUOTE_CHAR, "g"), '"');
    quoteChar = '"';
  }
  return new RegExp(`^ *${quoteChar}(([^${quoteChar}])*)${quoteChar} *$`).test(
    value,
  );
};

/**
 * Extract the quoted contents from a string. Examples:
 * `abc \" 123` returns null
 * `abc \"\" 123` returns null
 * `"abc \" 123"` returns null
 * `"abc \" 123"` returns null
 * `"abc 123"` returns `abc 123`
 * `  "abc 123"  ` returns `abc 123`
 */
export const extractQuotedString = (
  value: string,
  quoteChar = '"',
): string | null => {
  if (quoteChar === ENCODED_QUOTE_CHAR) {
    value = value.replace(new RegExp(ENCODED_QUOTE_CHAR, "g"), '"');
    quoteChar = '"';
  }
  const match = new RegExp(
    `^ *${quoteChar}(([^${quoteChar}])*)${quoteChar} *$`,
  ).exec(value);
  if (match) {
    return match[1];
  }
  return null;
};

/**
 * Remove surrounding quotes from a string, if surrounded, else return string.
 */
export const unquoteString = (value: string, quoteChar = '"'): string => {
  const possibleString = extractQuotedString(value, quoteChar);
  return possibleString != null ? possibleString : value;
};
