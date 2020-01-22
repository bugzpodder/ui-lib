// @flow
import moment from "moment";
import { DATE_FORMAT } from "../../constants/date-constants";

// TODO(nsawas): consolidate/rename with function from @grailbio/components/date
export const formatDate = (date: string | Date | moment$Moment): string => {
  if (!date) {
    return "";
  }
  return moment(date).format(DATE_FORMAT);
};

export const formatDateTime = (
  dateTime: string | Date | moment$Moment,
): string => {
  if (!dateTime) {
    return "";
  }
  return moment(dateTime).toISOString();
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
  startDate?: ?string,
  endDate?: ?string,
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
  format: string = DATE_FORMAT,
): ?string => {
  const momentDate = moment(date);
  if (date && momentDate.isValid()) {
    return momentDate.format(format);
  }
  return null;
};
