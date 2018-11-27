// @flow
/** Shared API utilities * */

import debounce from "lodash/debounce";
import escapeRegExp from "lodash/escapeRegExp";
import moment from "moment";
import partialRight from "lodash/partialRight";
import {
  BOOLEAN_SEARCH_TYPE,
  DATETIME_SEARCH_TYPE,
  DATE_SEARCH_TYPE,
  ENCODED_QUOTE_CHAR,
  ENCODED_STRING_END_CHAR,
  ENCODED_STRING_START_CHAR,
  ENUM_SEARCH_TYPE,
  FULL_ID_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_ID_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  MULTI_FIELD_TEXT_SEARCH_TYPE,
  NUMERIC_SEARCH_TYPE,
  OMNI_TEXT_SEARCH_TYPE,
  doubleAmpersand,
  doublePipe,
  percentChar,
} from "./api-constants";
import { DATE_FORMAT } from "../../constants";
import { extractQuotedString } from "../string-utils";
import { sanitizeId } from "../id-utils";

/*
Determine the page for the page query URL parameter
*/
export const getPage = (offset: number = 0, count: number = 10) => {
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
export const buildOrderQuery = (sortOptions: SortOptions = []) => {
  let order = sortOptions.reduce((memo, sortOption) => {
    const { id } = sortOption;
    let { desc } = sortOption;
    desc = desc ? "DESC" : "ASC";
    if (!id) {
      return memo;
    }
    if (memo.length > 0) {
      memo += ", ";
    }
    return `${memo}${id} ${desc}`;
  }, "" /* initial memo */);
  if (order) {
    order = `&order=${order}`;
  } else {
    order = "";
  }
  return order;
};

// $FlowFixMe `value.length` doesn't exist on mixed.
export const isValueValid = (value: mixed) => value !== "" && value != null && value.length !== 0;

/*
Using a Map or object of searchOptions, this builds a search query that and's each item for the
q query URL parameter of form:
q=(key=="value")&&(key=="%value%")&&(dateKey>="ISO8601date")

Note that an object's key order is not necessarily the same as the order it is defined in code.
It may often be, but that is implementation dependent and subject to change between browsers.
ES6 Map keys are iterated by insert order, and therefore iteration is deterministic.
Therefore, we should deprecate objects as inputs to improve testability.
*/

const getSearchValues = (searchOption: OldSearchOption | SearchOptionV2) => {
  const { type, value = "", values } = searchOption;
  let searchValues = [];
  if (Array.isArray(values)) {
    searchValues = values;
  } else if (Array.isArray(value)) {
    searchValues = value;
  } else if (value != null) {
    searchValues = [value];
  }

  if (type === FULL_ID_SEARCH_TYPE || type === LIKE_ID_SEARCH_TYPE) {
    searchValues = searchValues.reduce((memo, currValue) => {
      const sanitizedValue = sanitizeId(String(currValue));
      if (sanitizedValue !== currValue) {
        return [...memo, currValue, sanitizedValue];
      }
      return [...memo, currValue];
    }, []);
  }
  return searchValues;
};

export const buildSearchQuery = (searchOptions: SearchOptions | SearchOptionsV2 = new Map()) => {
  let query = "";
  // eslint-disable-next-line max-len
  const searchKeys = searchOptions instanceof Map ? Array.from(searchOptions.keys()) : searchOptions.map(({ name }) => name);
  query = searchKeys.reduce((memo, searchOptionKey) => {
    const searchOption = searchOptions instanceof Map
      ? searchOptions.get(searchOptionKey)
      : searchOptions.find(({ name }) => name === searchOptionKey);
    if (!searchOption) {
      return memo;
    }
    const {
      type, searchFields = [searchOptionKey], value = "", values, searchOperator,
    } = searchOption;
    const searchValues = getSearchValues(searchOption).map(global.encodeURIComponent);
    let equalityField = "==";
    equalityField = searchOperator === undefined ? equalityField : searchOperator.toString();
    // eslint-disable-next-line arrow-parens
    const multiValueSearchBuilder = formatter => {
      const multiValueSearch = searchValues.reduce((multiValueSearchMemo, value) => {
        if (!isValueValid(value)) {
          return multiValueSearchMemo;
        }
        const multiFieldSearch = searchFields.reduce((multiFieldSearchMemo, searchField) => {
          if (multiFieldSearchMemo) {
            multiFieldSearchMemo += doublePipe;
            return `${multiFieldSearchMemo}(${searchField}${equalityField}${formatter(String(value).trim())})`;
          }
          const result = `${searchField}${equalityField}${formatter(String(value).trim())}`;
          return searchFields.length > 1 ? `(${result})` : result;
        }, "");
        return `${multiValueSearchMemo}${multiValueSearchMemo && doublePipe}${multiFieldSearch}`;
      }, "");
      return multiValueSearch ? `(${multiValueSearch})` : null;
    };
    const newQuery = (() => {
      switch (type) {
        case LIKE_TEXT_SEARCH_TYPE:
        case OMNI_TEXT_SEARCH_TYPE:
          return multiValueSearchBuilder((value) => {
            let searchValue = value.trim();
            const quotedValue = extractQuotedString(searchValue, ENCODED_QUOTE_CHAR);
            if (quotedValue != null) {
              searchValue = quotedValue;
            } else {
              if (searchValue.startsWith(ENCODED_STRING_START_CHAR)) {
                searchValue = searchValue.substring(ENCODED_STRING_START_CHAR.length);
              } else {
                searchValue = `${percentChar}${searchValue}`;
              }
              if (searchValue.endsWith(ENCODED_STRING_END_CHAR)) {
                searchValue = searchValue.substring(0, searchValue.length - ENCODED_STRING_END_CHAR.length);
              } else {
                searchValue = `${searchValue}${percentChar}`;
              }
            }
            return `"${searchValue}"`;
          });
        case NUMERIC_SEARCH_TYPE:
        // fallthrough to next case
        case BOOLEAN_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `${value}`);
        case FULL_TEXT_SEARCH_TYPE:
        case ENUM_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${value.trim()}"`);
        case FULL_ID_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${value}"`);
        case LIKE_ID_SEARCH_TYPE:
          return multiValueSearchBuilder(value => `"${percentChar}${value}${percentChar}"`);
        case MULTI_FIELD_TEXT_SEARCH_TYPE: {
          // FIXME(jrosenfield) - Deprecate MULTI_FIELD_TEXT_SEARCH_TYPE since it
          // can be replaced with LIKE_TEXT_SEARCH_TYPE
          if (!isValueValid(value)) {
            return null;
          }
          const multiFieldSearch = searchFields.reduce((multiFieldSearchMemo, searchField) => {
            if (multiFieldSearchMemo) {
              multiFieldSearchMemo += doublePipe;
            }
            return `${multiFieldSearchMemo}(${searchField}${equalityField}"${percentChar}${String(
              value,
            ).trim()}${percentChar}")`;
          }, "");
          return `(${multiFieldSearch})`;
        }
        // Note: multiField is not implemented for date search.
        case DATE_SEARCH_TYPE:
        case DATETIME_SEARCH_TYPE: {
          if (!values && !Array.isArray(value)) {
            return null;
          }
          // Note: startDate or endDate could be null, undefined or "". Consider all as `unset`
          // $FlowFixMe: we know value is an array from above if statement.
          let [startDate, endDate] = values || value;
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
            dateSearch = `${dateSearch}${dateSearch && doubleAmpersand}${searchFields[0]}<="${endDate}"`;
          }
          return dateSearch ? `(${dateSearch})` : null;
        }
        default: {
          throw new Error(`Unknown search type: ${String(type)}`);
        }
      }
    })();
    if (memo && newQuery) {
      memo += doubleAmpersand;
    }

    return newQuery ? `${memo}${newQuery}` : memo;
  }, query);
  return query;
};

export const filterResults = (items: Array<any>, options: ApiQueryOptions): Array<any> => {
  const {
    count, offset, sortOptions, searchOptions,
  } = options;
  // eslint-disable-next-line max-len
  const searchKeys = searchOptions instanceof Map ? Array.from(searchOptions.keys()) : searchOptions.map(({ name }) => name);

  const filteredResults = items.filter(item => searchKeys.reduce((result, searchOptionKey) => {
    const searchOption = searchOptions instanceof Map
      ? searchOptions.get(searchOptionKey)
      : searchOptions.find(({ name }) => name === searchOptionKey);

    if (!result || !searchOption) {
      return false;
    }

    const { type, searchFields = [searchOptionKey], values } = searchOption;
    const searchValues = getSearchValues(searchOption);

    if (type === DATETIME_SEARCH_TYPE || type === DATE_SEARCH_TYPE) {
      if (searchFields.length === 0 || !item[searchFields[0]]) {
        return true;
      }
      if (!values) {
        return true;
      }
      // Note: startDate or endDate could be null, undefined or "". Consider all as `unset`
      let [startDate, endDate] = values;
      if (startDate && endDate) {
        if (moment(String(startDate)).isAfter(moment(String(endDate)))) {
          [startDate, endDate] = [endDate, startDate];
        }
      }

      const itemTime = moment(item[searchFields[0]]);
      return (
        (!startDate || itemTime.isAfter(moment(String(startDate))))
          && (!endDate || itemTime.isBefore(moment(String(endDate))))
      );
    }

    const validValues = searchValues.filter(value => isValueValid(value));
    if (validValues.length === 0) {
      return true;
    }

    let compare;
    switch (type) {
      case MULTI_FIELD_TEXT_SEARCH_TYPE:
      case LIKE_TEXT_SEARCH_TYPE:
      case OMNI_TEXT_SEARCH_TYPE:
        compare = (e, value) => new RegExp(escapeRegExp(String(value)), "i").test(e);
        break;
      case LIKE_ID_SEARCH_TYPE:
        compare = (e, value) => new RegExp(escapeRegExp(sanitizeId(String(value))), "i").test(e);
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
        const [itemKey, filterKey] = field.split(".");
        if (filterKey) {
          return found || (item[itemKey] && item[itemKey].some(e => compare(e[filterKey], value)));
        }
        return found || (isValueValid(item[field]) && compare(item[field], value));
      }, false);
    }, false);
    // eslint-disable-next-line space-in-parens
  }, true), );

  filteredResults.sort((a, b) => sortOptions.reduce((result, field) => {
    if (result !== 0 || !field.id || a[field.id] === b[field.id]) {
      return result;
    }
    if (a[field.id] < b[field.id]) {
      return field.desc ? 1 : -1;
    }
    return field.desc ? -1 : 1;
    // eslint-disable-next-line space-in-parens
  }, 0), );

  return filteredResults.slice(offset, offset + count);
};

/**
 * Debounces a request. This will call the function immediately if it hasn't been
 * called before. Otherwise, it waits until the next leading edge.
 * @param func The function to debounce.
 */
export const debounceRequest = partialRight(debounce, 500, { leading: true, trailing: false });
