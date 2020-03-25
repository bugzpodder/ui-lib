import { SearchOptionValues } from "../../types/api";
import { isArray } from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { History, Location } from "history";
import { KeyValue } from "../../types/common";
import { getOmniTextFromKeyValues } from "../omni-search-util";
import { getQuery, stringifyQuery, updateQuery } from "./url-util";

type SearchParams = {
  location: Location;
  history: History;
  searchOptions: SearchOptionValues;
};

export const flattenSearchValues = (
  searchValues: SearchOptionValues,
): Record<string, any> =>
  [...searchValues]
    .map(([key, { values }]) => ({ key, values }))
    .filter(({ values }) => {
      return isArray(values) && values.some((value) => value != null);
    })
    .reduce((acc, { key, values }) => {
      acc[key] = values.length === 1 ? values[0] : values;
      return acc;
    }, {});

export const expandSearchValues = (
  validSearchValues: Record<string, any>,
): SearchOptionValues => {
  try {
    const searchValues = new Map();
    Object.keys(validSearchValues).forEach((key) => {
      const result = validSearchValues[key];
      searchValues.set(key, { values: isArray(result) ? result : [result] });
    });
    return searchValues;
  } catch (error) {
    console.error(`Unable to parse searchValues from URL query: ${error}`);
    return new Map();
  }
};

export const extractSearchValues = (
  searchOptions: SearchOptionValues,
): SearchOptionValues => {
  const searchValues = new Map();
  searchOptions.forEach(({ values }, key) => {
    searchValues.set(key, {
      values: isArray(values) ? values.filter((value) => value != null) : [],
    });
  });
  return searchValues;
};

export const mergeSearchOptions = (
  searchOptions: SearchOptionValues,
  searchValues?: SearchOptionValues,
): SearchOptionValues => {
  if (!searchValues) {
    return searchOptions;
  }
  const newSearchOptions: SearchOptionValues = new Map(searchOptions);
  searchOptions.forEach((searchOption, key) => {
    if (searchValues && searchValues.has(key)) {
      const { values } = searchValues.get(key) || { values: [] };
      newSearchOptions.set(key, { ...searchOption, values });
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

const getUrlQuery = (searchValues: SearchOptionValues): Record<string, any> =>
  flattenSearchValues(searchValues);

export const updateSearchUrl = (
  { location, history, searchOptions }: SearchParams,
  options: Record<string, any> = {},
): void => {
  const searchValues = extractSearchValues(searchOptions);
  updateQuery({ location, history }, getUrlQuery(searchValues), {
    shouldUpdateBrowserHistory: false,
    ...options,
  });
};

export const getOmniUrlQueryString = (keyValues: KeyValue[]): string =>
  `${stringifyQuery({ omni: getOmniTextFromKeyValues(keyValues) })}`;
