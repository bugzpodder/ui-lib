import format from "date-fns/format";

import isDate from "date-fns/isDate";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import { DATE_UNICODE_FORMAT } from "../../constants/date-constants";

export const parseDate = (date: string | Date | null): Date | null => {
  if (!date) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore: Property isValid and toDate does not exist on string.
  if (date.isValid && date.toDate) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: Property isValid and toDate does not exist on string.
    return date.isValid() ? date.toDate() : null;
  }

  const dateObj = isDate(date) ? new Date(date) : parseISO(String(date));
  return dateObj && isValid(dateObj) ? dateObj : null;
};

// TODO(nsawas): consolidate/rename with function from @grailbio/components/date
export const formatDate = (date: string | Date | null): string => {
  const dateObj = parseDate(date);
  return dateObj && isValid(dateObj)
    ? format(dateObj, DATE_UNICODE_FORMAT)
    : "";
};

export const formatDateTime = (dateTime: string | Date | null): string => {
  const dateObj = parseDate(dateTime);
  return dateObj && isValid(dateObj) ? dateObj.toISOString() : "";
};

export const DATE_RANGE_DELIMITER = "(?:(?:-)|(?:to))";
export const WRAPPED_DATE_RANGE_DELIMITERS = `(?:\\s+${DATE_RANGE_DELIMITER})|(?:${DATE_RANGE_DELIMITER}\\s+)`;
export const DATE_REGEX_BLOCK = "((?:[-\\d]+)|(?:[-\\d]+T[-\\d:.]+Z))";
// Given a string, extract start and end dates, using optional delimiter of either ` - `, ` to `
// Supported examples:
// "2018-04-20 to 2019-04-20"
// "2018-04-20 to"
// "2018-04-20" same as above
// "to 2018-04-20"
// " to 2018-04-20"
// Also, supported, `to` replaced with `-`
export const extractDateRange = (dateRangeString: string) => {
  const dateRangeRegExp = new RegExp(
    `^${DATE_REGEX_BLOCK}?\\s*(?:${WRAPPED_DATE_RANGE_DELIMITERS})\\s*${DATE_REGEX_BLOCK}?$`,
  );
  const match = dateRangeRegExp.exec(dateRangeString);
  if (!match) {
    return {
      startDate: dateRangeString,
      endDate: undefined,
    };
  }
  const [, startDate, endDate] = match;
  return {
    startDate,
    endDate,
  };
};

export const buildDateRangeString = (dateRange: {
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const { startDate, endDate } = dateRange;
  if (startDate) {
    if (endDate) {
      return `${startDate} to ${endDate}`;
    }
    return startDate;
  }
  if (endDate) {
    return `to ${endDate}`;
  }
  return "";
};

export const extractValidDate = (
  date: string,
  dateFormat: string = DATE_UNICODE_FORMAT,
): string | null => {
  if (!date) {
    return null;
  }

  const dateObj = parse(date, dateFormat, new Date());
  return dateObj && isValid(dateObj) ? format(dateObj, dateFormat) : null;
};
