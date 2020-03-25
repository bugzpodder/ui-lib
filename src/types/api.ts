/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";

// Sort Options:
export type SortOption = { id: string; desc?: boolean };

// Search Options. Used by API calls to build the query:
export type SearchOptionValue = {
  values: any[];
};
export type SearchOptionValues = Map<string, SearchOptionValue>;

export type PaginationOptions = {
  offset: number;
  count: number;
};

export type SearchDef = {
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

export type SearchOption = SearchOptionValue & SearchDef;

export type GetContentOptions = {
  offset?: number;
  count?: number;
  searchOptions?: SearchOption[];
  sortOptions?: SortOption[];
};

export type OmniQueryOptions = {
  /** `isUserSearchAction` is true when the omni query is updated by the user. */
  isUserSearchAction?: boolean;
  searchOptions: SearchOption[];
};

// TODO(nsawas): simplify all these types!
export type ApiQueryOptions = {
  searchOptions: SearchOption[];
  sortOptions: SortOption[];
  selectedRowIds: any[];
  isLoading: boolean;
} & PaginationOptions;

export type OmniSearchDef = {
  name: string;
  searchFields: string[];
  Component?: React.FC<SearchFieldProps>;
  aliases?: string[];
  description?: string;
  localStorageKeySuffix?: string;
  // TODO(nsawas): support validation in the future?
} & SearchDef;

export type OmniSearchValues = Map<number, string>;

// Search Definitions. Used by OmniSearch to build the UI.
export type SearchFieldProps = {
  searchKey: string;
  placeholder: string;
  searchValue: string | null;
  searchDefs: OmniSearchDef[];
  searchValues: OmniSearchValues;
  onChange: (x0: string, x1: any) => any;
  onSearch: () => any;
  isFullWidth?: boolean;
};

export type SearchApi = {
  searchDefs: OmniSearchDef[];
  setSearchOptions: (options: OmniQueryOptions) => any;
  getInitialValues?: (searchDefs: OmniSearchDef[]) => OmniSearchValues;
};

export type OmniSearchCommand = {
  command: string;
  omniFieldName: string;
  omniValues?: string[];
};

export type ApiOptions = {
  handleError?: (x0: string, x1: Record<string, any>) => any;
  handleWarning?: (x0: string, x1: Record<string, any>) => any;
  hasResultInResponse?: boolean;
  [key: string]: any;
};

export type JsonResult<T> = {
  result: T;
  status: number;
  statusIsOk: boolean;
  errorMessages: string[];
  errorMessage: string;
  errorCodes: string[];
  warningMessages: string[];
  warningMessage: string;
  warningCodes: string[];
};

export type ApiIssue = {
  message: string;
  path: string;
  errorCode?: string;
};

export type ApiProblems = {
  errors: ApiIssue[];
  warnings: ApiIssue[];
};

export type UnprocessedJsonResult = {
  result?: Record<string, any>;
  errors?: ApiProblems;
};

export type ApiDispatchers = {
  handleError: (errorMessage: string, object: Record<string, any>) => any;
  handleWarning: (warningMessage: string, object: Record<string, any>) => any;
  dispatchIsLoading: (x0: boolean) => any;
  dispatchIsSaving: (x0: boolean) => any;
};

export type ApiObjectProcessors = {
  processInbound: (object: any, options: ApiOptions) => any;
  processOutbound: (object: any, options: ApiOptions) => any;
};
