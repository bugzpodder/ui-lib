/// <reference types="lodash" />
declare type Option = {
    shouldUpdateBrowserHistory?: boolean;
    shouldReplaceQuery?: boolean;
};
export declare const getPathname: (props?: {
    [x: string]: any;
}) => string;
export declare const getQuery: (props?: {
    [x: string]: any;
}) => {
    [x: string]: any;
};
export declare const stringifyQuery: (query?: {
    [x: string]: any;
}) => string;
export declare const updateQueryInternal: (props?: {
    [x: string]: any;
}, newQueries?: {
    [x: string]: any;
}, options?: Option) => void;
export declare const updateQuery: ((props?: {
    [x: string]: any;
}, newQueries?: {
    [x: string]: any;
}, options?: Option) => void) & import("lodash").Cancelable;
export {};
