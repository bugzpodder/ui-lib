// @flow
import debounce from "lodash/debounce";
import qs from "qs";
import { isValueValid } from "@grail/lib";
import equals from "lodash/fp/equals";

type Option = {
	shouldUpdateBrowserHistory?: boolean,
	shouldReplaceQuery?: boolean,
};

export const getPathname = (props: Object = {}): string => {
	const { location = {} } = props;
	return location.pathname || "";
};

export const getQuery = (props: Object = {}): Object => {
	const { location = {} } = props;
	const { search = "" } = location;
	return qs.parse(search.slice(1));
};

export const stringifyQuery = (query: Object = {}): string => {
	Object.keys(query).forEach(key => !isValueValid(query[key]) && delete query[key]); // delete params with empty string values
	return qs.stringify(query);
};

export const updateQueryInternal = (props: Object = {}, newQueries: Object = {}, options: Option = {}) => {
	const query = getQuery(props);
	const { history } = props;

	if (!history) {
		return;
	}

	const { shouldUpdateBrowserHistory = false, shouldReplaceQuery = false } = options;
	const historyOperation = shouldUpdateBrowserHistory ? history.push : history.replace;
	const newQuery = shouldReplaceQuery === true ? newQueries : { ...query, ...newQueries };
	if (!equals(query, newQuery)) {
		historyOperation({ search: `?${stringifyQuery(newQuery)}` });
	}
};

export const updateQuery = debounce(updateQueryInternal, 100);
