// @flow
import camelCase from "lodash/camelCase";
import startCase from "lodash/startCase";

import { ENCODED_QUOTE_CHAR } from "../api-utils/api-constants";
import { generateFilledArray } from "../array-utils";

// Map of sentence case key words to their desired display string.
const KEYWORDS: Map<string, string> = new Map([
  ["Ngs", "NGS"],
  ["Npc", "NPC"],
  ["Qpcr", "qPCR"],
  ["Ml", "mL"],
  ["Ul", "µL"],
  ["Pl", "pL"],
  ["Lims", "LIMS"],
  ["Grail", "GRAIL"],
]);

export const sentenceCase = (string: string) => {
  string = string || "";
  const sentenceCased = startCase(camelCase(string.trim()));
  const separator = " ";
  return sentenceCased
    .split(separator)
    .map(word => KEYWORDS.get(word) || word)
    .join(separator);
};

const charCodeOfA = "A".charCodeAt(0);

export const upperAlphaChars = generateFilledArray(26, (_, index) => String.fromCharCode(charCodeOfA + index));

export const normalizeStr = (str: ?string) => {
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
export const makeTitleString = (str: string, capFirst: boolean = true) => str
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
export const formatPercent = (value: string | number) => {
  const floatValue = parseFloat(value);
  if (Number.isNaN(floatValue)) {
    return "-";
  }
  return `${(floatValue * 100.0).toFixed(2)}%`;
};

export const isQuotedString = (value: string, quoteChar?: string = '"'): boolean => {
  if (quoteChar === ENCODED_QUOTE_CHAR) {
    value = value.replace(new RegExp(ENCODED_QUOTE_CHAR, "g"), '"');
    quoteChar = '"';
  }
  return new RegExp(`^ *${quoteChar}(([^${quoteChar}])*)${quoteChar} *$`).test(value);
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
export const extractQuotedString = (value: string, quoteChar?: string = '"'): string | null => {
  if (quoteChar === ENCODED_QUOTE_CHAR) {
    value = value.replace(new RegExp(ENCODED_QUOTE_CHAR, "g"), '"');
    quoteChar = '"';
  }
  const match = new RegExp(`^ *${quoteChar}(([^${quoteChar}])*)${quoteChar} *$`).exec(value);
  if (match) {
    return match[1];
  }
  return null;
};

/**
 * Remove surrounding quotes from a string, if surrounded, else return string.
 */
export const unquoteString = (value: string, quoteChar?: string = '"'): string => {
  const possibleString = extractQuotedString(value, quoteChar);
  return possibleString != null ? possibleString : value;
};
