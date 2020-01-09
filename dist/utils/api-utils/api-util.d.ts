import { GetContentOptions, SearchOption, SortOption } from "../../types/api";
export declare const getPage: (offset?: number, count?: number) => number;
export declare const boolToString: (bool: boolean) => string;
export declare const buildOrderQuery: (sortOptions?: SortOption[]) => string;
export declare const isValueValid: (value: any) => boolean;
export declare const buildCustomURIQueryParams: (searchOptions: SearchOption[] | undefined, params: URLSearchParams) => Promise<void>;
export declare const buildSearchQuery: (searchOptions?: SearchOption[]) => Promise<string>;
export declare const buildQuery: (contentOptions?: GetContentOptions) => Promise<URLSearchParams>;
export declare const filterResults: (items: any[], options: GetContentOptions) => any[];
/**
 * Debounces a request. This will call the function immediately if it hasn't been
 * called before. Otherwise, it waits until the next leading edge.
 * @param func The function to debounce.
 */
export declare const debounceRequest: (...args: any[]) => any;
