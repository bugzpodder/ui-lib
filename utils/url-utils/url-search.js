// @flow
import isArray from "lodash/isArray";
import { getQuery, stringifyQuery, updateQuery } from "@grail/lib/utils";

type SearchParams = { location: Location, history: HistoryFunctions, searchOptions: SearchOptions };

const isDefinedNotNull = (value: mixed) => {
	return value !== undefined && value !== null;
};

export const flattenSearchValues = (searchValues: SearchOptionValues) => {
	const validSearchValues = [...searchValues]
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
	return validSearchValues;
};

export const expandSearchValues = (validSearchValues: Object): SearchOptionValues => {
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

export const extractSearchValues = (searchOptions: SearchOptions): SearchOptionValues => {
	const searchValues = new Map();
	searchOptions.forEach(({ value, values }, key) => {
		if (values) {
			// Convert `undefined` values as null, to ensure they are serialized.
			values = [...values].map(value => (value === undefined ? null : value));
		}
		searchValues.set(key, { value, values });
	});
	return searchValues;
};

export const mergeSearchOptions = (searchOptions: SearchOptions, searchValues?: SearchOptionValues) => {
	if (!searchValues) {
		return searchOptions;
	}
	const newSearchOptions: SearchOptions = new Map(searchOptions);
	searchOptions.forEach((searchOption, key) => {
		if (searchValues && searchValues.has(key)) {
			const { value, values } = searchValues.get(key) || {};
			newSearchOptions.set(key, { ...searchOption, value, values });
		}
	});
	return newSearchOptions;
};

export const getSearchValues = ({ location }: { location: Location }): SearchOptionValues => {
	const validSearchValues = getQuery({ location }) || {};
	return expandSearchValues(validSearchValues);
};

const getUrlQuery = (searchValues: SearchOptionValues): Object => {
	return flattenSearchValues(searchValues);
};

export const updateSearchUrl = ({ location, history, searchOptions }: SearchParams, options: Object = {}) => {
	const searchValues = extractSearchValues(searchOptions);
	updateQuery({ location, history }, getUrlQuery(searchValues), {
		shouldUpdateBrowserHistory: false,
		...options,
	});
};

export const getUrlQueryString = (key: string, value: SearchOptionValueItem) => {
	const searchValues = new Map().set(key, { value });
	return `${stringifyQuery(getUrlQuery(searchValues))}`;
};

export const getUrlQueryStringForValues = (key: string, values: Array<SearchOptionValueItem>) => {
	const searchValues = new Map().set(key, { values });
	return `${stringifyQuery(getUrlQuery(searchValues))}`;
};

export const getUrlQueryForOptions = (searchOptions: SearchOptions) => {
	const searchValues = extractSearchValues(searchOptions);
	return `${stringifyQuery(getUrlQuery(searchValues))}`;
};
