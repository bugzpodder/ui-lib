export declare const parseDate: (date: string | Date | null) => Date | null;
export declare const formatDate: (date: string | Date | null) => string;
export declare const formatDateTime: (dateTime: string | Date | null) => string;
export declare const DATE_RANGE_DELIMITER = "(?:(?:-)|(?:to))";
export declare const WRAPPED_DATE_RANGE_DELIMITERS: string;
export declare const DATE_REGEX_BLOCK = "((?:[-\\d]+)|(?:[-\\d]+T[-\\d:.]+Z))";
export declare const extractDateRange: (dateRangeString: string) => {
    startDate: string;
    endDate?: string | undefined;
};
export declare const buildDateRangeString: (dateRange: {
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}) => string;
export declare const extractValidDate: (date: string, dateFormat?: string) => string | null;
