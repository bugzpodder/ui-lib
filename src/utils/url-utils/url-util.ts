import qs from "qs";
import { debounce, isEqual } from "lodash";
import { isValueValid } from "../api-utils";

type Option = {
  shouldUpdateBrowserHistory?: boolean;
  shouldReplaceQuery?: boolean;
};

export const getPathname = (props: Record<string, any> = {}): string => {
  const { location = {} } = props;
  return location.pathname || "";
};

export const getQuery = (
  props: Record<string, any> = {},
): Record<string, any> => {
  const { location = {} } = props;
  const { search = "" } = location;
  return qs.parse(search.slice(1));
};

export const stringifyQuery = (query: Record<string, any> = {}): string => {
  // delete params with empty string values
  Object.keys(query).forEach(
    (key) => !isValueValid(query[key]) && delete query[key],
  );
  return qs.stringify(query);
};

export const updateQueryInternal = (
  props: Record<string, any> = {},
  newQueries: Record<string, any> = {},
  options: Option = {},
): void => {
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
  if (!isEqual(query, newQuery)) {
    historyOperation({ search: `?${stringifyQuery(newQuery)}` });
  }
};

export const updateQuery = debounce(updateQueryInternal, 100);
