import {
  ENUM_SEARCH_TYPE,
  OMNI_TEXT_SEARCH_TYPE,
  isValueValid,
} from "../api-utils";
import { KeyValue } from "../../types/common";
import { OMNI_ERROR, OMNI_KEY } from "../../constants/omni";
import { OmniSearchDef, OmniSearchValues, SearchOption } from "../../types/api";

// FIXME(jrosenfield): add documentation for regexes
const validOmniText = /^(([^:]*\s+)?[\w-.]+:)*[^:]*$/;
const searchKey = /(([^:]*\s*)\s)?([\w-.]+):/gm;

const addItemToArrayMap = (
  key: string,
  value: string,
  arrayMap: Map<string, string[]>,
): void => {
  if (value === "" || isValueValid(value)) {
    const removedLeadingWhitespaceMatch = /\s*(.*)/.exec(value);
    value = removedLeadingWhitespaceMatch
      ? removedLeadingWhitespaceMatch[1]
      : value;
    const previousValues = arrayMap.get(key);
    if (previousValues === undefined) {
      arrayMap.set(key, [value]);
    } else {
      arrayMap.set(key, [...previousValues, value]);
    }
  }
};

/** Parse a map of field label to field value, using OMNI_KEY if no label is present. */
export const parseValuesFromOmniText = (
  omniText: string,
): Map<string, string[]> => {
  const parsed: Map<string, string[]> = new Map();
  if (!validOmniText.test(omniText)) {
    const error = new Error("Invalid search text.");
    error.name = OMNI_ERROR;
    throw error;
  }
  let key = OMNI_KEY;
  let lastIndex = 0;
  let result = searchKey.exec(omniText);
  while (result !== null) {
    addItemToArrayMap(key, result[2], parsed);
    // eslint-disable-next-line prefer-destructuring
    key = result[3];
    // eslint-disable-next-line prefer-destructuring
    lastIndex = searchKey.lastIndex;
    result = searchKey.exec(omniText);
  }
  addItemToArrayMap(key, omniText.slice(lastIndex), parsed);
  // parsed values contain comma delimited values.
  // Note - the values could be an array of comma delimited strings. Split to array of strings.
  // At this point:
  // omni text of `assay: npc, ngs, qpcr` generated a map like `assay` => `["npc, ngs, qpcr"]`
  // omni text of `assay: npc assay: ngs, qpcr` generated a map like `assay`=> `["npc", "ngs, qpcr"]`
  // Make both options generate a map like `assay` => `["npc", "ngs", "qpcr"]`
  //
  // This is probably more desirable, however, it does lose the ability to regenerate the original omni text.
  parsed.forEach((values: string[], key) => {
    values = values.reduce(
      (acc: string[], value) => [...acc, ...value.split(",")],
      [],
    );
    parsed.set(key, values);
  });
  return parsed;
};

export const getKeysForSearchDef = (searchDef: OmniSearchDef): string[] => {
  const { aliases } = searchDef;
  if (aliases !== undefined && aliases.length) {
    return [...aliases, ...searchDef.searchFields];
  }
  return [...searchDef.searchFields];
};

/** Go through searchDefs extract values from omniText */
export const getSearchValuesFromOmniText = (
  searchDefs: OmniSearchDef[] | null,
  omniText: string,
): OmniSearchValues => {
  if (!isValueValid(omniText) || !searchDefs || searchDefs.length === 0) {
    return new Map();
  }
  const searchValues: Map<number, string> = new Map();
  const parsedValues = parseValuesFromOmniText(omniText);

  searchDefs.forEach((searchDef, index) => {
    let keys = getKeysForSearchDef(searchDef);
    if (index === 0) {
      if (searchDef.type === OMNI_TEXT_SEARCH_TYPE) {
        keys = [];
      }
      keys.unshift(OMNI_KEY);
    }
    let values: string[] = [];
    keys.forEach((key) => {
      const parsedValueArray = parsedValues.get(key);
      if (parsedValueArray !== undefined) {
        parsedValues.delete(key);
        values = values.concat(parsedValueArray);
      }
    });
    if (searchDef.type === ENUM_SEARCH_TYPE) {
      values = values.map((value) => value.trim());
    }
    if (values.length) {
      const searchValue = values.join(",");
      searchValues.set(index, searchValue);
    }
  });

  // If there are field labels that could not be mapped to a searchDef, the omniText is invalid.
  const invalidKey = Array.from(parsedValues.keys()).find((key) => !!key);
  if (invalidKey) {
    const error = new Error(`${invalidKey} is not a valid search tag.`);
    error.name = OMNI_ERROR;
    throw error;
  }
  return searchValues;
};

export const getOmniTextFromSearchValues = (
  searchDefs: OmniSearchDef[],
  searchValues: OmniSearchValues,
): string => {
  const omniValues: string[] = [];
  searchDefs.forEach((searchDef, index) => {
    const searchValue = searchValues.get(index);
    if (isValueValid(searchValue)) {
      let omniValue = searchValue;
      if (index !== 0) {
        const key = getKeysForSearchDef(searchDef)[0];
        omniValue = `${key}: ${omniValue}`;
      }
      omniValues.push(String(omniValue));
    }
  });
  return omniValues.join(" ");
};

export const getOmniTextFromKeyValues = (keyValues: KeyValue[]): string =>
  keyValues.map(({ key, value }) => `${key}: ${value}`).join(" ");

export const getItemsFromOmniValue = (omniValue = ""): string[] => {
  const parsedItems: string[] = [];
  if (!isValueValid(omniValue)) {
    return parsedItems;
  }
  return omniValue
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "");
};

export const getSearchOptions = (
  searchDefs: OmniSearchDef[],
  searchValues: OmniSearchValues,
): SearchOption[] => {
  const searchOptions: SearchOption[] = [];
  searchDefs.forEach((searchDef, index) => {
    const values = getItemsFromOmniValue(searchValues.get(index));
    if (isValueValid(values)) {
      searchOptions.push({ ...searchDef, values });
    }
  });
  return searchOptions;
};

export const getValueItemsFromSearchValues = (
  searchDefs: OmniSearchDef[],
  searchValues: OmniSearchValues,
  key: string,
): string[] => {
  const matchingSearchDefIndex = searchDefs.findIndex((searchDef) =>
    getKeysForSearchDef(searchDef).includes(key),
  );
  if (matchingSearchDefIndex >= 0) {
    const omniValues = searchValues.get(matchingSearchDefIndex);
    if (omniValues) {
      return getItemsFromOmniValue(omniValues);
    }
  }
  return [];
};
