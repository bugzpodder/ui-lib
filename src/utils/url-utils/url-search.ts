import isArray from "lodash/isArray";
import { DeprecatedSearchOptions, SearchOptionValues } from "../../types/api";
import { KeyValue } from "../../types/common";
import { getOmniTextFromKeyValues } from "../omni-search-util";
import { getQuery, stringifyQuery, updateQuery } from "./url-util";

type SearchParams = {
  location: Location;
  history: History;
  searchOptions: DeprecatedSearchOptions;
};

const isDefinedNotNull = (value: any) => value !== undefined && value !== null;

export const flattenSearchValues = (searchValues: SearchOptionValues) =>
  [...searchValues]
    .map(([key, { value, values }]) => ({ key, value, values }))
    .filter(({ value, values }) => {
      if (!isDefinedNotNull(value) && values === undefined) {
        return false;
      }
      if (value === undefined && values !== undefined) {
        if (!values.length || !values.some(isDefinedNotNull)) {
          return false;
        }
      }
      return true;
    })
    .reduce((acc, { key, value, values }) => {
      acc[key] = isDefinedNotNull(value) ? value : values;
      return acc;
    }, {});

export const expandSearchValues = (validSearchValues: {
  [x: string]: any;
}): SearchOptionValues => {
  try {
    const searchValues = new Map();
    Object.keys(validSearchValues).forEach(key => {
      const result = validSearchValues[key];
      if (isArray(result)) {
        searchValues.set(key, { values: result });
      } else {
        searchValues.set(key, { value: result });
      }
    });
    return searchValues;
  } catch (error) {
    console.error(`Unable to parse searchValues from URL query: ${error}`);
    return new Map();
  }
};

export const extractSearchValues = (
  searchOptions: DeprecatedSearchOptions,
): SearchOptionValues => {
  const searchValues = new Map();
  searchOptions.forEach(({ value, values }, key) => {
    if (values) {
      values = values.filter(value => value != null);
    }
    searchValues.set(key, { value, values });
  });
  return searchValues;
};

export const mergeSearchOptions = (
  searchOptions: DeprecatedSearchOptions,
  searchValues?: SearchOptionValues,
): DeprecatedSearchOptions => {
  if (!searchValues) {
    return searchOptions;
  }
  const newSearchOptions: DeprecatedSearchOptions = new Map(searchOptions);
  searchOptions.forEach((searchOption, key) => {
    if (searchValues && searchValues.has(key)) {
      const { value, values } = searchValues.get(key) || {};
      newSearchOptions.set(key, { ...searchOption, value, values });
    }
  });
  return newSearchOptions;
};

export const getSearchValues = ({
  location,
}: {
  location: Location;
}): SearchOptionValues => {
  const validSearchValues = getQuery({ location });
  return expandSearchValues(validSearchValues);
};

const getUrlQuery = (
  searchValues: SearchOptionValues,
): {
  [x: string]: any;
} => flattenSearchValues(searchValues);

export const updateSearchUrl = (
  { location, history, searchOptions }: SearchParams,
  options: {
    [x: string]: any;
  } = {},
) => {
  const searchValues = extractSearchValues(searchOptions);
  updateQuery({ location, history }, getUrlQuery(searchValues), {
    shouldUpdateBrowserHistory: false,
    ...options,
  });
};

export const getOmniUrlQueryString = (keyValues: KeyValue[]) =>
  `${stringifyQuery({ omni: getOmniTextFromKeyValues(keyValues) })}`;
