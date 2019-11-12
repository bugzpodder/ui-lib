import { DeprecatedSearchOptions } from "../../types/api";
import { KeyValue } from "../../types/common";
declare type SearchParams = {
    location: Location;
    history: History;
    searchOptions: DeprecatedSearchOptions;
};
export declare const flattenSearchValues: (searchValues: Map<string, import("../../types/api").SearchOptionValue>) => {};
export declare const expandSearchValues: (validSearchValues: {
    [x: string]: any;
}) => Map<string, import("../../types/api").SearchOptionValue>;
export declare const extractSearchValues: (searchOptions: Map<string, import("../../types/api").DeprecatedSearchOption>) => Map<string, import("../../types/api").SearchOptionValue>;
export declare const mergeSearchOptions: (searchOptions: Map<string, import("../../types/api").DeprecatedSearchOption>, searchValues?: Map<string, import("../../types/api").SearchOptionValue> | undefined) => Map<string, import("../../types/api").DeprecatedSearchOption>;
export declare const getSearchValues: ({ location, }: {
    location: Location;
}) => Map<string, import("../../types/api").SearchOptionValue>;
export declare const updateSearchUrl: ({ location, history, searchOptions }: SearchParams, options?: {
    [x: string]: any;
}) => void;
export declare const getOmniUrlQueryString: (keyValues: KeyValue[]) => string;
export {};
