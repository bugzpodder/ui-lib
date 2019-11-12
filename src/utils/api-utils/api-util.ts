/** Shared API utilities * */

import debounce from "lodash/debounce";
import escapeRegExp from "lodash/escapeRegExp";
import get from "lodash/get";
import isString from "lodash/isString";
import moment from "moment";
import partialRight from "lodash/partialRight";
import {
  BOOLEAN_SEARCH_TYPE,
  DATETIME_SEARCH_TYPE,
  DATE_SEARCH_TYPE,
  DATE_SEARCH_TYPES,
  ENUM_SEARCH_TYPE,
  FULL_ID_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_ID_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  NUMERIC_SEARCH_TYPE,
  OMNI_TEXT_SEARCH_TYPE,
  URI_QUERY_TYPE,
} from "./api-constants";
import { DATE_FORMAT } from "../../constants";
import {
  DeprecatedSearchOption,
  DeprecatedSearchOptions,
  GetContentOptionsV2,
  SearchOptionV2,
  SearchOptionsV2,
  SortOption,
} from "types/api";
import { extractDateRange } from "../date-utils";
import { extractQuotedString } from "../string-utils";
import { sanitizeId } from "../id-utils";

/*
Determine the page for the page query URL parameter
*/
export const getPage = (offset = 0, count = 10) => {
  let page = offset / count + 1;
  page = Math.floor(page);
  return page;
};

/*
Convert boolean to
*/
export const boolToString = (bool: boolean): string => (bool ? "1" : "0");

/*
Builds an order query that and's each item for the order query URL parameter
*/
export const buildOrderQuery = (sortOptions: SortOption[] = []) =>
  sortOptions.reduce((memo, sortOption) => {
    const { id } = sortOption;
    const desc = sortOption.desc ? "DESC" : "ASC";
    if (!id) {
      return memo;
    }
    if (memo.length > 0) {
      memo += ", ";
    }
    return `${memo}${id} ${desc}`;
  }, "" /* initial memo */);

export const isValueValid = (value: any) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== "" && value != null;
};

const getSearchValues = (searchOption: DeprecatedSearchOption): string[] => {
  const { value = "", values } = searchOption;
  let searchValues: string[] = [];
  if (Array.isArray(values)) {
    searchValues = values;
  } else if (Array.isArray(value)) {
    searchValues = value;
  } else if (value != null) {
    searchValues = [value];
  }
  return searchValues;
};

const getEscapedSearchValues = (searchOption: SearchOptionV2) => {
  const { values, type } = searchOption;
  let searchValues = values;
  if (type === FULL_ID_SEARCH_TYPE || type === LIKE_ID_SEARCH_TYPE) {
    searchValues = searchValues.reduce((memo: string[], currValue) => {
      const sanitizedValue = sanitizeId(String(currValue));
      if (sanitizedValue !== currValue) {
        return [...memo, currValue, sanitizedValue];
      }
      return [...memo, currValue];
    }, []);
  }
  return searchValues;
};

const getSearchOptionsV2 = (
  deprecatedSearchOptions: DeprecatedSearchOptions = new Map(),
) => {
  const searchOptionsV2: SearchOptionsV2 = [];
  deprecatedSearchOptions.forEach((searchOption, name) => {
    const values = getSearchValues(searchOption);
    const { type, searchFields, searchOperator, includeNulls } = searchOption;
    searchOptionsV2.push({
      name,
      type,
      searchFields: searchFields || [name],
      values,
      searchOperator,
      includeNulls,
    });
  });
  return searchOptionsV2;
};

const resolveSearchOptions = async (searchOptions: SearchOptionsV2 = []) =>
  Promise.all(
    searchOptions.map(async searchOption => {
      const { type, mapValues } = searchOption;
      let { values } = searchOption;
      const isDateSearchType = DATE_SEARCH_TYPES.includes(type);
      if (mapValues) {
        values = await mapValues(values);
      }
      values = getEscapedSearchValues({ ...searchOption, values }).map(
        value => {
          if (isDateSearchType) {
            return value;
          }
          return value;
        },
      );
      return { ...searchOption, values };
    }),
  );

export const buildCustomURIQueryParams = async (
  searchOptions: SearchOptionsV2 = [],
  params: URLSearchParams,
) => {
  const resolvedSearchOptions = await resolveSearchOptions(
    searchOptions.filter(
      searchOption => searchOption && searchOption.queryType === URI_QUERY_TYPE,
    ),
  );
  return resolvedSearchOptions
    .filter(searchOption => searchOption.values && searchOption.values.length)
    .forEach(({ searchFields, values }) => {
      if (searchFields) {
        values.forEach(value => {
          params.append(searchFields[0], value);
        });
      }
    });
};

/*
Using an array of searchOptionsV2, this builds a search query that joins each item with && for the
q query URL parameter of form:
q=(key=="value")&&(key=="%value%")&&(dateKey>="ISO8601date")
*/
export const buildSearchQuery = async (searchOptions: SearchOptionsV2 = []) => {
  const resolvedSearchOptions = await resolveSearchOptions(
    searchOptions.filter(
      searchOption => searchOption && !searchOption.queryType,
    ),
  );
  const query = resolvedSearchOptions.reduce((memo, searchOption) => {
    const {
      type,
      values,
      searchFields = [searchOption.name],
      includeNulls,
    } = searchOption;
    const isDateSearchType = DATE_SEARCH_TYPES.includes(type);
    const { searchOperator = "==" } = searchOption;
    let initialSubQuery = "";
    if (includeNulls) {
      initialSubQuery = searchFields.reduce((memo, searchField) => {
        const nullQuery = `${searchField}=="NULL"`;
        if (memo) {
          return `${memo}||(${nullQuery})`;
        }
        return searchFields.length > 1 ? `(${nullQuery})` : nullQuery;
      }, "");
    }
    const multiValueSearchBuilder = formatter => {
      const multiValueSearch = values.reduce((multiValueSearchMemo, value) => {
        if (!isValueValid(value)) {
          return multiValueSearchMemo;
        }
        const multiFieldSearch = searchFields.reduce(
          (multiFieldSearchMemo, searchField) => {
            const formattedResult = `${formatter(String(value).trim())}`;
            const subQuery = isDateSearchType
              ? formattedResult
              : `${searchField}${searchOperator}${formattedResult}`;
            if (multiFieldSearchMemo) {
              multiFieldSearchMemo += "||";
              return `${multiFieldSearchMemo}(${subQuery})`;
            }
            return searchFields.length > 1 ? `(${subQuery})` : subQuery;
          },
          "",
        );
        return `${multiValueSearchMemo}${multiValueSearchMemo &&
          "||"}${multiFieldSearch}`;
      }, initialSubQuery);
      if (!multiValueSearch) {
        return null;
      }
      return searchOptions.length > 1
        ? `(${multiValueSearch})`
        : multiValueSearch;
    };
    const newQuery = (() => {
      switch (type) {
        case LIKE_TEXT_SEARCH_TYPE:
        case OMNI_TEXT_SEARCH_TYPE:
          return multiValueSearchBuilder(value => {
            let searchValue = value.trim();
            const quotedValue = extractQuotedString(searchValue);
            if (quotedValue != null) {
              searchValue = quotedValue;
            } else {
              if (searchValue.startsWith("^")) {
                searchValue = searchValue.substring(1);
              } else {
                searchValue = `%${searchValue}`;
              }
              if (searchValue.endsWith("$")) {
                searchValue = searchValue.substring(0, searchValue.length - 1);
              } else {
                searchValue = `${searchValue}%`;
              }
            }
            return `"${searchValue}"`;
          });
        case NUMERIC_SEARCH_TYPE:
        // fallthrough to next case
        case BOOLEAN_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `${value}`);
        case FULL_TEXT_SEARCH_TYPE:
        // fallthrough to next case
        case ENUM_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${value.trim()}"`);
        case FULL_ID_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${value}"`);
        case LIKE_ID_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${value}%"`);
        case DATE_SEARCH_TYPE:
        case DATETIME_SEARCH_TYPE: {
          return multiValueSearchBuilder(dateRangeString => {
            // Note: startDate or endDate could be null, undefined or "". Consider all as `unset`
            let { startDate, endDate } = extractDateRange(
              dateRangeString || "",
            );
            if (startDate && endDate) {
              if (moment(String(startDate)).isAfter(moment(String(endDate)))) {
                [startDate, endDate] = [endDate, startDate];
              }
            }
            let dateSearch = "";
            if (isValueValid(startDate) && String(startDate).trim() !== "") {
              if (type === DATETIME_SEARCH_TYPE) {
                startDate = moment(String(startDate))
                  .startOf("day")
                  .toISOString();
              } else {
                startDate = moment(String(startDate)).format(DATE_FORMAT);
              }
              dateSearch = `${searchFields[0]}>="${startDate}"`;
            }
            if (isValueValid(endDate) && String(endDate).trim() !== "") {
              if (type === DATETIME_SEARCH_TYPE) {
                endDate = moment(String(endDate))
                  .endOf("day")
                  .toISOString();
              } else {
                endDate = moment(String(endDate)).format(DATE_FORMAT);
              }
              dateSearch = `${dateSearch}${dateSearch && "&&"}${
                searchFields[0]
              }<="${endDate}"`;
            }
            // NOTE: Must wrap the dateSearch in brackets, since it could be or'd in the wrapper.
            return dateSearch ? `(${dateSearch})` : "";
          });
        }
        default: {
          throw new Error(`Unknown search type: ${String(type)}`);
        }
      }
    })();
    if (memo && newQuery) {
      memo += "&&";
    }

    return newQuery ? `${memo}${newQuery}` : memo;
  }, "");
  return query;
};

export const buildQuery = async (
  contentOptions: GetContentOptionsV2 = {},
): Promise<URLSearchParams> => {
  const { offset, count, searchOptions, sortOptions } = contentOptions;

  const orderQuery = buildOrderQuery(sortOptions);
  let page = "";
  if (offset || count) {
    page = String(getPage(offset, count));
  }

  const params = new URLSearchParams();
  const [searchQuery] = await Promise.all([
    buildSearchQuery(searchOptions),
    buildCustomURIQueryParams(searchOptions, params),
  ]);
  if (searchQuery) {
    params.append("q", searchQuery);
  }
  if (page) {
    params.append("page", page);
  }
  if (count) {
    params.append("count", String(count));
  }
  if (orderQuery) {
    params.append("order", orderQuery);
  }

  return params;
};

/*
Using a Map of searchOptions, this builds a search query that and's each item for the
q query URL parameter of form:
q=(key=="value")&&(key=="%value%")&&(dateKey>="ISO8601date")
*/
// eslint-disable-next-line max-len
export const deprecatedBuildSearchQuery = (
  deprecatedSearchOptions: DeprecatedSearchOptions,
) => buildSearchQuery(getSearchOptionsV2(deprecatedSearchOptions));

export const filterResults = (
  items: Array<any>,
  options: GetContentOptionsV2,
): Array<any> => {
  const { count, offset, sortOptions = [], searchOptions = [] } = options;

  const filteredResults = items.filter(item =>
    searchOptions.reduce((result: boolean, searchOption) => {
      if (!result || !searchOption) {
        return false;
      }

      const {
        type,
        searchFields = [searchOption.name],
        values,
        includeNulls,
      } = searchOption;
      const searchValues = getEscapedSearchValues(searchOption);

      if (DATE_SEARCH_TYPES.includes(type)) {
        if (searchFields.length === 0 || !item[searchFields[0]]) {
          return true;
        }
        if (!values) {
          return true;
        }
        // Note: startDate or endDate could be null, undefined or "". Consider all as `unset`
        let { startDate, endDate } = extractDateRange(values[0] || "");
        if (startDate && endDate) {
          if (moment(String(startDate)).isAfter(moment(String(endDate)))) {
            [startDate, endDate] = [endDate, startDate];
          }
        }

        const itemTime = moment(item[searchFields[0]]);
        return (
          (!startDate || itemTime.isAfter(moment(String(startDate)))) &&
          (!endDate || itemTime.isBefore(moment(String(endDate))))
        );
      }

      const validValues = searchValues.filter(value => isValueValid(value));
      if (validValues.length === 0) {
        return true;
      }

      let compare;
      switch (type) {
        case LIKE_TEXT_SEARCH_TYPE:
        case OMNI_TEXT_SEARCH_TYPE:
          compare = (e, value) =>
            new RegExp(escapeRegExp(String(value)), "i").test(e);
          break;
        case LIKE_ID_SEARCH_TYPE:
          compare = (e, value) =>
            new RegExp(escapeRegExp(sanitizeId(String(value))), "i").test(e);
          break;
        case BOOLEAN_SEARCH_TYPE:
          compare = (e, value) => !!e === value || String(e) === String(value);
          break;
        case NUMERIC_SEARCH_TYPE:
        // fallthrough
        case FULL_TEXT_SEARCH_TYPE:
        case ENUM_SEARCH_TYPE:
          compare = (e, value) => e === value;
          break;
        case FULL_ID_SEARCH_TYPE:
          compare = (e, value) => e === sanitizeId(String(value));
          break;
        default:
          throw new Error(`Unknown search type: ${String(type)}`);
      }

      return validValues.reduce((searchResult, value) => {
        if (searchResult || !isValueValid(value)) {
          return searchResult;
        }
        return searchFields.reduce((found, field) => {
          if (found) {
            return true;
          }
          const tokens = field.split(".");
          const itemKey = tokens.shift();
          const filterKey = tokens.join(".");

          if (filterKey && itemKey != null && Array.isArray(item[itemKey])) {
            return item[itemKey].some(e => {
              const resultValue = get(e, filterKey);
              if (includeNulls && resultValue == null) {
                return true;
              }
              return (
                isValueValid(resultValue) && compare(get(e, filterKey), value)
              );
            });
          }

          const resultValue = get(item, field);
          if (includeNulls && resultValue == null) {
            return true;
          }
          return isValueValid(resultValue) && compare(resultValue, value);
        }, false);
      }, false);
    }, true),
  );

  if (sortOptions.length) {
    filteredResults.sort((a, b) =>
      sortOptions.reduce((result, field) => {
        if (result !== 0 || !field.id) {
          return result;
        }

        const tokens = field.id.split(".");
        const itemKey = tokens.shift();
        const filterKey = tokens.join(".");

        if (itemKey == null) {
          return result;
        }

        const aResult = Array.isArray(a[itemKey])
          ? get(a[itemKey][0], filterKey)
          : get(a, field.id);

        const bResult = Array.isArray(b[itemKey])
          ? get(b[itemKey][0], filterKey)
          : get(b, field.id);

        if (aResult === bResult) {
          return result;
        }
        if (isString(aResult) && isString(bResult)) {
          const result = aResult.localeCompare(bResult, undefined, {
            numeric: true,
          });
          return field.desc ? -result : result;
        }

        if (aResult == null || aResult < bResult) {
          return field.desc ? 1 : -1;
        }
        return field.desc ? -1 : 1;
      }, 0),
    );
  }

  return offset || count
    ? filteredResults.slice(offset, Number(offset) + Number(count))
    : filteredResults;
};

/**
 * Debounces a request. This will call the function immediately if it hasn't been
 * called before. Otherwise, it waits until the next leading edge.
 * @param func The function to debounce.
 */
export const debounceRequest = partialRight(debounce, 500, {
  leading: true,
  trailing: false,
});
