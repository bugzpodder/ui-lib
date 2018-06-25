// @flow
/** Shared API utilities **/

import keys from "lodash/keys";
import escapeRegExp from "lodash/escapeRegExp";
import partialRight from "lodash/partialRight";
import debounce from "lodash/debounce";
import moment from "moment";
import { DATE_FORMAT } from "@grail/lib/constants";

import {
	BOOLEAN_SEARCH_TYPE,
	DATE_SEARCH_TYPE,
	DATETIME_SEARCH_TYPE,
	FULL_TEXT_SEARCH_TYPE,
	LIKE_TEXT_SEARCH_TYPE,
	MULTI_FIELD_TEXT_SEARCH_TYPE,
	NUMERIC_SEARCH_TYPE,
	FULL_ID_SEARCH_TYPE,
	LIKE_ID_SEARCH_TYPE,
	doubleAmpersand,
	doublePipe,
	percentChar,
} from "./api-constants";

/*
Determine the page for the page query URL parameter
*/
export const getPage = (offset: number = 0, count: number = 10) => {
	let page = offset / count + 1;
	page = Math.floor(page);
	return page;
};

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
	}, "" /*initial memo*/);
	if (order) {
		order = `&order=${order}`;
	} else {
		order = "";
	}
	return order;
};

export const isValueValid = (value: mixed) => {
	// $FlowFixMe: undefined is not equal to 0 so there are no type errors here
	return value !== "" && value !== undefined && value !== null && value.length !== 0;
};

const SANITIZATION_EXCEPTIONS = [
	/^NPC/, // Mock NPC qPCR/NGS samples (ex: NPC-QPCR-1A, NPC-NGS-1)
	/^A/, // Accession labels (ex: A00014L-1)
];
export const sanitizeId = (id: string = "") => {
	id = id.trim();

	// Do not sanitize if id matches any exceptions (mock NGS, qPCR, accession samples)
	if (SANITIZATION_EXCEPTIONS.some(regex => regex.test(id))) {
		return id;
	}
	return id.replace(/-/g, "");
};

/*
Using a Map or object of searchOptions, this builds a search query that and's each item for the
q query URL parameter of form:
q=(key=="value")&&(key=="%value%")&&(dateKey>="ISO8601date")

Note that an object's key order is not necessarily the same as the order it is defined in code.
It may often be, but that is implementation dependent and subject to change between browsers.
ES6 Map keys are iterated by insert order, and therefore iteration is deterministic.
Therefore, we should deprecate objects as inputs to improve testability.
*/

export const buildSearchQuery = (searchOptions: SearchOptions | LegacySearchOptions = new Map()) => {
	let query = "";
	const searchKeys = searchOptions instanceof Map ? Array.from(searchOptions.keys()) : keys(searchOptions);
	query = searchKeys.reduce((memo, searchOptionKey) => {
		const searchOption =
			searchOptions instanceof Map ? searchOptions.get(searchOptionKey) : searchOptions[searchOptionKey];
		if (!searchOption) {
			return memo;
		}
		const {
			rawQuery,
			isEqual,
			type,
			searchFields = [searchOptionKey],
			value = "",
			values,
			searchOperator,
		} = searchOption;
		const searchValues = Array.isArray(values) ? values : Array.isArray(value) ? value : [value];
		let equalityField = isEqual === undefined || isEqual ? "==" : "!=";
		equalityField = searchOperator === undefined ? equalityField : searchOperator.toString();
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
					return `${searchField}${equalityField}${formatter(String(value).trim())}`;
				}, "");
				return `${multiValueSearchMemo}${multiValueSearchMemo && doublePipe}${multiFieldSearch}`;
			}, "");
			return multiValueSearch ? `(${multiValueSearch})` : null;
		};
		const newQuery = (() => {
			if (!rawQuery) {
				switch (type) {
					case LIKE_TEXT_SEARCH_TYPE:
						return multiValueSearchBuilder(value => `"${percentChar}${value.trim()}${percentChar}"`);
					case NUMERIC_SEARCH_TYPE:
					// fallthrough to next case
					case BOOLEAN_SEARCH_TYPE:
						return multiValueSearchBuilder(value => `${value}`);
					case FULL_TEXT_SEARCH_TYPE:
						return multiValueSearchBuilder(value => `"${value.trim()}"`);
					case FULL_ID_SEARCH_TYPE:
						return multiValueSearchBuilder(value => `"${sanitizeId(value)}"`);
					case LIKE_ID_SEARCH_TYPE:
						return multiValueSearchBuilder(value => `"${percentChar}${sanitizeId(value)}${percentChar}"`);
					case MULTI_FIELD_TEXT_SEARCH_TYPE: {
						// FIXME(jrosenfield) - Deprecate MULTI_FIELD_TEXT_SEARCH_TYPE since it can be replaced with LIKE_TEXT_SEARCH_TYPE
						if (!isValueValid(value)) {
							return;
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
					// FIXME(jrosenfield): DATETIME_SEARCH_TYPE should not convert to toISOString
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
			} else {
				return `(${rawQuery})`;
			}
		})();
		if (memo && newQuery) {
			memo += doubleAmpersand;
		}

		return newQuery ? `${memo}${newQuery}` : memo;
	}, query);
	return query;
};

export const filterResults = (items: Array<any>, options: FilterOptions): Array<any> => {
	const { count, offset, sortOptions, searchOptions } = options;
	const searchKeys = Array.from(searchOptions.keys());

	const filteredResults = items.filter(item => {
		return searchKeys.reduce((result, key) => {
			const searchOption = searchOptions.get(key);
			if (!result || !searchOption) {
				return false;
			}

			const { rawQuery, type, searchFields, isEqual, value = "", values } = searchOption;
			const searchValues = Array.isArray(values) ? values : [value];
			const shouldEqual = !!(isEqual === undefined || isEqual);
			if (rawQuery) {
				throw new Error("Unsupported raw query");
			}

			if (type === DATETIME_SEARCH_TYPE || type === DATE_SEARCH_TYPE) {
				if (!item[key]) {
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
				return (
					(!startDate || moment(item[key]).isAfter(moment(String(startDate)))) &&
					(!endDate || moment(item[key]).isBefore(moment(String(endDate))))
				);
			}

			const validValues = searchValues.filter(value => isValueValid(value));
			if (validValues.length === 0) {
				return true;
			}

			return validValues.reduce((searchResult, value) => {
				if (searchResult || !isValueValid(value)) {
					return searchResult;
				}
				const [itemKey, filterKey] = key.split(".");
				const regExp = new RegExp(escapeRegExp(String(value)), "i");
				const idRegExp = new RegExp(escapeRegExp(sanitizeId(String(value))), "i");

				if (filterKey) {
					switch (type) {
						case LIKE_TEXT_SEARCH_TYPE:
							return item[itemKey] && item[itemKey].some(e => regExp.test(e[filterKey])) === shouldEqual;
						case LIKE_ID_SEARCH_TYPE:
							return item[itemKey] && item[itemKey].some(e => idRegExp.test(e[filterKey])) === shouldEqual;
						case BOOLEAN_SEARCH_TYPE:
							return item[itemKey] && item[itemKey].some(e => !!e[filterKey] === value) === shouldEqual;
						case NUMERIC_SEARCH_TYPE:
						// fallthrough
						case FULL_TEXT_SEARCH_TYPE:
							return item[itemKey] && item[itemKey].some(e => e[filterKey] === value) === shouldEqual;
						case FULL_ID_SEARCH_TYPE:
							return (
								item[itemKey] && item[itemKey].some(e => e[filterKey] === sanitizeId(String(value))) === shouldEqual
							);
						default:
					}
				} else {
					switch (type) {
						case LIKE_TEXT_SEARCH_TYPE:
							return isValueValid(item[key]) && regExp.test(item[key]) === shouldEqual;
						case LIKE_ID_SEARCH_TYPE:
							return isValueValid(item[key]) && idRegExp.test(item[key]) === shouldEqual;
						case BOOLEAN_SEARCH_TYPE:
							return shouldEqual ? !!item[key] === value : !!item[key] !== value;
						case NUMERIC_SEARCH_TYPE:
						// fallthrough
						case FULL_TEXT_SEARCH_TYPE:
							return shouldEqual ? item[key] === value : item[key] !== value;
						case FULL_ID_SEARCH_TYPE:
							return shouldEqual ? item[key] === sanitizeId(String(value)) : item[key] !== sanitizeId(String(value));
						default:
					}
				}

				if (type === MULTI_FIELD_TEXT_SEARCH_TYPE) {
					if (!searchFields) {
						throw new Error("Requires `searchFields`");
					}
					return searchFields.reduce((found, field) => {
						const [itemKey, filterKey] = field.split(".");
						if (filterKey) {
							return found || (item[itemKey] && item[itemKey].some(e => regExp.test(e[filterKey])) === shouldEqual);
						}
						return found || (isValueValid(item[field]) && shouldEqual === regExp.test(item[field]));
					}, false);
				}
				throw new Error(`Unknown search type: ${String(type)}`);
			}, false);
		}, true);
	});

	filteredResults.sort((a, b) => {
		return sortOptions.reduce((result, field) => {
			if (result !== 0 || !field.id || a[field.id] === b[field.id]) {
				return result;
			} else if (a[field.id] < b[field.id]) {
				return field.desc ? 1 : -1;
			}
			return field.desc ? -1 : 1;
		}, 0);
	});

	return filteredResults.slice(offset, offset + count);
};

/**
 * Debounces a request. This will call the function immediately if it hasn't been
 * called before. Otherwise, it waits until the next leading edge.
 * @param func The function to debounce.
 */
export const debounceRequest = partialRight(debounce, 500, { leading: true, trailing: false });
