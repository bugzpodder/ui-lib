import debounce from "lodash/debounce";
import equals from "lodash/fp/equals";
import qs from "qs";
import { isValueValid } from "../api-utils";

type Option = {
  shouldUpdateBrowserHistory?: boolean;
  shouldReplaceQuery?: boolean;
};

export const getPathname = (
  props: {
    [x: string]: any;
  } = {},
): string => {
  const { location = {} } = props;
  return location.pathname || "";
};

export const getQuery = (
  props: {
    [x: string]: any;
  } = {},
): {
  [x: string]: any;
} => {
  const { location = {} } = props;
  const { search = "" } = location;
  return qs.parse(search.slice(1));
};

export const stringifyQuery = (
  query: {
    [x: string]: any;
  } = {},
): string => {
  // delete params with empty string values
  Object.keys(query).forEach(
    key => !isValueValid(query[key]) && delete query[key],
  );
  return qs.stringify(query);
};

export const updateQueryInternal = (
  props: {
    [x: string]: any;
  } = {},
  newQueries: {
    [x: string]: any;
  } = {},
  options: Option = {},
) => {
  const query = getQuery(props);
  const { history } = props;

  if (!history) {
    return;
  }

  const {
    shouldUpdateBrowserHistory = false,
    shouldReplaceQuery = false,
  } = options;
  const historyOperation = shouldUpdateBrowserHistory
    ? history.push
    : history.replace;
  const newQuery =
    shouldReplaceQuery === true ? newQueries : { ...query, ...newQueries };
  if (!equals(query, newQuery)) {
    historyOperation({ search: `?${stringifyQuery(newQuery)}` });
  }
};

export const updateQuery = debounce(updateQueryInternal, 100);
