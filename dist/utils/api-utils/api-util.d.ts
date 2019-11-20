import { DeprecatedSearchOption, GetContentOptionsV2, SearchOptionV2, SortOption } from "../../types/api";
export declare const getPage: (offset?: number, count?: number) => number;
export declare const boolToString: (bool: boolean) => string;
export declare const buildOrderQuery: (sortOptions?: SortOption[]) => string;
export declare const isValueValid: (value: any) => boolean;
export declare const buildCustomURIQueryParams: (searchOptions: SearchOptionV2[] | undefined, params: URLSearchParams) => Promise<void>;
export declare const buildSearchQuery: (searchOptions?: SearchOptionV2[]) => Promise<string>;
export declare const buildQuery: (contentOptions?: GetContentOptionsV2) => Promise<URLSearchParams>;
export declare const deprecatedBuildSearchQuery: (deprecatedSearchOptions: Map<string, DeprecatedSearchOption>) => Promise<string>;
export declare const filterResults: (items: any[], options: GetContentOptionsV2) => any[];
/**
 * Debounces a request. This will call the function immediately if it hasn't been
 * called before. Otherwise, it waits until the next leading edge.
 * @param func The function to debounce.
 */
export declare const debounceRequest: (...args: any[]) => any;
