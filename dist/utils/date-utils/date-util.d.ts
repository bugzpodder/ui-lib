import moment from "moment";
export declare const formatDate: (date: string | Date | moment.Moment) => string;
export declare const formatDateTime: (dateTime: string | Date | moment.Moment) => string;
export declare const DATE_RANGE_DELIMITER = "(?:(?:-)|(?:to))";
export declare const WRAPPED_DATE_RANGE_DELIMITERS: string;
export declare const DATE_REGEX_BLOCK = "((?:[-\\d]+)|(?:[-\\d]+T[-\\d:.]+Z))";
export declare const extractDateRange: (dateRangeString: string) => {
    startDate: string;
    endDate: undefined;
} | {
    startDate: string;
    endDate: string;
};
export declare const buildDateRangeString: (dateRange: {
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}) => string;
export declare const extractValidDate: (date: string, format?: string) => string | null | undefined;
