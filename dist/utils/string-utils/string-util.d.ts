export declare const sentenceCase: (string: string, keywords?: Map<string, string>) => string;
export declare const upperAlphaChars: any[];
export declare const normalizeStr: (str: string) => string;
export declare const makeTitleString: (str: string, capFirst?: boolean) => string;
/**
 * Formats a float as a percentage, rounding to two decimal points.
 * The number is typically already rounded in the back-end, but we round again
 * because floating-point arithmetic on an already-rounded number might generate
 * a value like 4.32000000000000001.
 * @param value The float to format.
 */
export declare const formatPercent: (value: any) => string;
export declare const isQuotedString: (value: string, quoteChar?: string) => boolean;
/**
 * Extract the quoted contents from a string. Examples:
 * `abc \" 123` returns null
 * `abc \"\" 123` returns null
 * `"abc \" 123"` returns null
 * `"abc \" 123"` returns null
 * `"abc 123"` returns `abc 123`
 * `  "abc 123"  ` returns `abc 123`
 */
export declare const extractQuotedString: (value: string, quoteChar?: string) => string | null;
/**
 * Remove surrounding quotes from a string, if surrounded, else return string.
 */
export declare const unquoteString: (value: string, quoteChar?: string) => string;
