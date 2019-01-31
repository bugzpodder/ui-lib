// Sort Options:
declare type SortOption = { id: string, desc?: boolean };
declare type SortOptions = Array<SortOption>;

// Search Options. Used by API calls to build the query:
declare type SearchOptionValue = {
  // TODO(jsingh) Deprecate singular value
  value?: ?string,
  values?: Array<string>,
};
declare type SearchOptionValues = Map<string, SearchOptionValue>;

declare type DeprecatedSearchOption = {
  type: Symbol,
  searchFields?: Array<string>,
  isCustomRendered?: boolean,
  placeholder?: string,
  searchOperator?: string,
  includeNulls?: boolean,
} & SearchOptionValue;

declare type DeprecatedSearchOptions = Map<string, DeprecatedSearchOption>;

declare type PaginationOptions = {
  offset: number,
  count: number,
};

declare type DeprecatedGetContentOptions = {
  offset?: number,
  count?: number,
  searchOptions?: DeprecatedSearchOptions,
  sortOptions?: SortOptions,
};

declare type GetContentOptionsV2 = {
  offset?: number,
  count?: number,
  searchOptions?: SearchOptionsV2,
  sortOptions?: SortOptions,
};

// TODO(jsingh): simplify all these types!
declare type ApiQueryOptions = {
  searchOptions: SearchOptionsV2,
  sortOptions: SortOptions,
  selectedRowIds: Array<any>,
  isLoading: boolean,
} & PaginationOptions;

// Search Definitions. Used by OmniSearch to build the UI. Used to build DeprecatedSearchOptions:
type SearchFieldProps = {
  searchKey: string,
  placeholder: string,
  searchValue: ?string,
  searchDefs: OmniSearchDefs,
  searchValues: OmniSearchValues,
  onChange: (string, any) => any,
  onSearch: () => any,
  isFullWidth?: boolean,
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
  localStorageKeySuffix?: string,
};

declare type OmniSearchDef = {
  name: string,
  searchFields: Array<string>,
  Component?: React$StatelessFunctionalComponent<SearchFieldProps>,
  aliases?: Array<string>,
  description?: string,
  localStorageKeySuffix?: string,
  // TODO(jrosenfield): support validation in the future?
} & SearchDef;

declare type SearchDefs = Array<SearchDef>;
declare type OmniSearchDefs = Array<OmniSearchDef>;

declare type OmniSearchValues = Map<number, string>;

declare type SearchOptionV2 = {
  values: Array<string>,
} & SearchDef;

declare type SearchOptionsV2 = Array<SearchOptionV2>;

declare type SearchApi = {
  searchDefs: OmniSearchDefs,
  setSearchOptions: Function,
  getInitialValues?: Function,
};

type OmniSearchCommand = {
  command: string,
  omniFieldName: string,
  omniValues?: Array<string>,
};
