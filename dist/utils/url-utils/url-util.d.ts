/// <reference types="lodash" />
declare type Option = {
    shouldUpdateBrowserHistory?: boolean;
    shouldReplaceQuery?: boolean;
};
export declare const getPathname: (props?: Record<string, any>) => string;
export declare const getQuery: (props?: Record<string, any>) => Record<string, any>;
export declare const stringifyQuery: (query?: Record<string, any>) => string;
export declare const updateQueryInternal: (props?: Record<string, any>, newQueries?: Record<string, any>, options?: Option) => void;
export declare const updateQuery: ((props?: Record<string, any>, newQueries?: Record<string, any>, options?: Option) => void) & import("lodash").Cancelable;
export {};
