import React from "react";
export declare type SortOption = {
    id: string;
    desc?: boolean;
};
export declare type SearchOptionValue = {
    values: any[];
};
export declare type SearchOptionValues = Map<string, SearchOptionValue>;
export declare type PaginationOptions = {
    offset: number;
    count: number;
};
export declare type SearchDef = {
    name: string;
    type: symbol;
    searchFields?: string[];
    Component?: React.FC<SearchFieldProps>;
    aliases?: string[];
    description?: string;
    searchOperator?: string;
    includeNulls?: boolean;
    queryType?: symbol;
    localStorageKeySuffix?: string;
    mapValues?: (x0: string[]) => Promise<string[]> | string[];
    mapValuesDispatcher?: (x0: any) => (x0: string[]) => Promise<string[]>;
};
export declare type SearchOption = SearchOptionValue & SearchDef;
export declare type GetContentOptions = {
    offset?: number;
    count?: number;
    searchOptions?: SearchOption[];
    sortOptions?: SortOption[];
};
export declare type OmniQueryOptions = {
    /** `isUserSearchAction` is true when the omni query is updated by the user. */
    isUserSearchAction?: boolean;
    searchOptions: SearchOption[];
};
export declare type ApiQueryOptions = {
    searchOptions: SearchOption[];
    sortOptions: SortOption[];
    selectedRowIds: any[];
    isLoading: boolean;
} & PaginationOptions;
export declare type OmniSearchDef = {
    name: string;
    searchFields: string[];
    Component?: React.FC<SearchFieldProps>;
    aliases?: string[];
    description?: string;
    localStorageKeySuffix?: string;
} & SearchDef;
export declare type OmniSearchValues = Map<number, string>;
export declare type SearchFieldProps = {
    searchKey: string;
    placeholder: string;
    searchValue: string | null;
    searchDefs: OmniSearchDef[];
    searchValues: OmniSearchValues;
    onChange: (x0: string, x1: any) => any;
    onSearch: () => any;
    isFullWidth?: boolean;
};
export declare type SearchApi = {
    searchDefs: OmniSearchDef[];
    setSearchOptions: (options: OmniQueryOptions) => any;
    getInitialValues?: (searchDefs: OmniSearchDef[]) => OmniSearchValues;
};
export declare type OmniSearchCommand = {
    command: string;
    omniFieldName: string;
    omniValues?: string[];
};
export declare type ApiOptions = {
    handleError?: (x0: string, x1: Record<string, any>) => any;
    handleWarning?: (x0: string, x1: Record<string, any>) => any;
    hasResultInResponse?: boolean;
    [key: string]: any;
};
export declare type JsonResult<T> = {
    result: T;
    status: number;
    statusIsOk: boolean;
    errorMessages: string[];
    errorMessage: string;
    errorCodes: string[];
    warningMessages: string[];
    warningMessage: string;
};
export declare type ApiIssue = {
    message: string;
    path: string;
    errorCode?: string;
};
export declare type ApiProblems = {
    errors: ApiIssue[];
    warnings: ApiIssue[];
};
export declare type UnprocessedJsonResult = {
    result?: Record<string, any>;
    errors?: ApiProblems;
};
export declare type ApiDispatchers = {
    handleError: (errorMessage: string, object: Record<string, any>) => any;
    handleWarning: (warningMessage: string, object: Record<string, any>) => any;
    dispatchIsLoading: (x0: boolean) => any;
    dispatchIsSaving: (x0: boolean) => any;
};
export declare type ApiObjectProcessors = {
    processInbound: (object: any, options: ApiOptions) => any;
    processOutbound: (object: any, options: ApiOptions) => any;
};
