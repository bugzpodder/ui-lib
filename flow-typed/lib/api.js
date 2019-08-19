// @flow
// Sort Options:
declare type SortOption = { id: string, desc?: boolean };
declare type SortOptions = Array<SortOption>;

// Search Options. Used by API calls to build the query:
declare type SearchOptionValue = {
  // TODO(jsingh) Deprecate singular value
  value?: ?string,
  values?: Array<string>
};
declare type SearchOptionValues = Map<string, SearchOptionValue>;

declare type DeprecatedSearchOption = {
  type: Symbol,
  searchFields?: Array<string>,
  isCustomRendered?: boolean,
  placeholder?: string,
  searchOperator?: string,
  includeNulls?: boolean
} & SearchOptionValue;

declare type DeprecatedSearchOptions = Map<string, DeprecatedSearchOption>;

declare type PaginationOptions = {
  offset: number,
  count: number
};

declare type DeprecatedGetContentOptions = {
  offset?: number,
  count?: number,
  searchOptions?: DeprecatedSearchOptions,
  sortOptions?: SortOptions
};

declare type GetContentOptionsV2 = {
  offset?: number,
  count?: number,
  searchOptions?: SearchOptionsV2,
  sortOptions?: SortOptions
};

declare type OmniQueryOptionsV2 = {
  /** `isUserSearchAction` is true when the omni query is updated by the user. */
  isUserSearchAction?: boolean,
  searchOptions: SearchOptionsV2
};

// TODO(jsingh): simplify all these types!
declare type ApiQueryOptions = {
  searchOptions: SearchOptionsV2,
  sortOptions: SortOptions,
  selectedRowIds: Array<any>,
  isLoading: boolean
} & PaginationOptions;

// Search Definitions. Used by OmniSearch to build the UI. Used to build DeprecatedSearchOptions:
declare type SearchFieldProps = {
  searchKey: string,
  placeholder: string,
  searchValue: ?string,
  searchDefs: OmniSearchDefs,
  searchValues: OmniSearchValues,
  onChange: (string, any) => any,
  onSearch: () => any,
  isFullWidth?: boolean
};

declare type SearchDef = {
  name: string,
  type: Symbol,
  searchFields?: Array<string>,
  Component?: React$StatelessFunctionalComponent<SearchFieldProps>,
  aliases?: Array<string>,
  description?: string,
  searchOperator?: string,
  includeNulls?: boolean,
  queryType?: Symbol,
  localStorageKeySuffix?: string,
  mapValues?: (Array<string>) => Promise<Array<string>> | Array<string>,
  mapValuesDispatcher?: any /* Dispatch */ => (
    Array<string>
  ) => Promise<Array<string>>
};

declare type OmniSearchDef = {
  name: string,
  searchFields: Array<string>,
  Component?: React$StatelessFunctionalComponent<SearchFieldProps>,
  aliases?: Array<string>,
  description?: string,
  localStorageKeySuffix?: string
  // TODO(jrosenfield): support validation in the future?
} & SearchDef;

declare type SearchDefs = Array<SearchDef>;
declare type OmniSearchDefs = Array<OmniSearchDef>;

declare type OmniSearchValues = Map<number, string>;

declare type SearchOptionV2 = {
  values: Array<string>
} & SearchDef;

declare type SearchOptionsV2 = Array<SearchOptionV2>;

declare type SearchApi = {
  searchDefs: OmniSearchDefs,
  setSearchOptions: Function,
  getInitialValues?: Function
};

declare type OmniSearchCommand = {
  command: string,
  omniFieldName: string,
  omniValues?: Array<string>
};

declare type ApiOptions = {
  handleError?: (string, Object) => any,
  handleWarning?: (string, Object) => any,
  hasResultInResponse?: boolean,
  [string]: any
};

declare type JsonResult = {
  result: any,
  status: number,
  statusIsOk: boolean,
  errorMessages: Array<string>,
  errorMessage: string,
  errorCodes: Array<string>,
  warningMessages: Array<string>,
  warningMessage: string
};

declare type UnprocessedJsonResult = {
  result?: Object,
  errors?: ApiIssues
};

declare type ApiIssues = {
  errors: Array<ApiIssue>,
  warnings: Array<ApiIssue>
};

declare type ApiIssue = {
  message: string,
  path: string,
  errorCode?: string
};

declare type ApiDispatchers = {
  handleError: (errorMessage: string, object: Object) => any,
  handleWarning: (warningMessage: string, object: Object) => any,
  dispatchIsLoading: boolean => any,
  dispatchIsSaving: boolean => any
};

declare type ApiObjectProcessors = {
  processInbound: (object: any, options: ApiOptions) => any,
  processOutbound: (object: any, options: ApiOptions) => any
};
