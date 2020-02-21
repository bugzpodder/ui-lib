import { SearchOptionValues } from "../../types/api";
import { History, Location } from "history";
import { KeyValue } from "../../types/common";
declare type SearchParams = {
    location: Location;
    history: History;
    searchOptions: SearchOptionValues;
};
export declare const flattenSearchValues: (searchValues: SearchOptionValues) => Record<string, any>;
export declare const expandSearchValues: (validSearchValues: Record<string, any>) => SearchOptionValues;
export declare const extractSearchValues: (searchOptions: SearchOptionValues) => SearchOptionValues;
export declare const mergeSearchOptions: (searchOptions: SearchOptionValues, searchValues?: SearchOptionValues | undefined) => SearchOptionValues;
export declare const getSearchValues: ({ location, }: {
    location: Location<History.PoorMansUnknown>;
}) => SearchOptionValues;
export declare const updateSearchUrl: ({ location, history, searchOptions }: SearchParams, options?: Record<string, any>) => void;
export declare const getOmniUrlQueryString: (keyValues: KeyValue[]) => string;
export {};
