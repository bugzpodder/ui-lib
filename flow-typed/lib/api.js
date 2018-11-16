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

declare type OldSearchOption = {
  type?: Symbol,
  searchFields?: Array<string>,
  isCustomRendered?: boolean,
  placeholder?: string,
  searchOperator?: Symbol,
} & SearchOptionValue;

declare type SearchOptions = Map<string, OldSearchOption>;

declare type PaginationOptions = {
  offset: number,
  count: number,
};

declare type FilterOptions = {
  sortOptions: SortOptions,
  searchOptions: SearchOptions,
} & PaginationOptions;

declare type GetContentOptions = {
  offset?: number,
  count?: number,
  searchOptions?: SearchOptions,
  sortOptions?: SortOptions,
};

declare type GetContentOptionsV2 = {
  offset?: number,
  count?: number,
  searchOptions?: SearchOptionsV2,
  sortOptions?: SortOptions,
};

// TODO(jsingh): simplify all these types!
declare type BaseQueryOptions = {
  searchOptions?: SearchOptions | SearchOptionsV2,
  sortOptions: SortOptions,
  selectedRowIds: Array<any>,
  isLoading: boolean,
} & PaginationOptions;

declare type LegacyApiQueryOptions = {
  // TODO(jsingh): cleanup flow search definitions
  // $FlowFixMe
  searchOptions: SearchOptions,
} & BaseQueryOptions;

declare type ApiQueryOptions = {
  searchOptions: SearchOptionsV2,
} & BaseQueryOptions;

// Search Definitions. Used by OmniSearch to build the UI. Used to build SearchOptions:
type SearchFieldProps = {
  searchKey: string,
  placeholder: string,
  searchValue: ?string,
  searchDefs: SearchDefs,
  searchValues: SearchValues,
  onChange: (string, any) => any,
  onSearch: () => any,
  isFullWidth?: boolean,
};

declare type SearchDef = {
  name: string,
  type: Symbol,
  searchFields: Array<string>,
  Component?: React$StatelessFunctionalComponent<SearchFieldProps>,
  aliases?: Array<string>,
  description?: string,
  searchOperator?: string,
  localStorageKeySuffix?: string,
  // TODO(jrosenfield): support validation in the future?
};

declare type SearchDefs = Array<SearchDef>;

declare type SearchValues = Map<number, string>;

declare type SearchOptionV2 = {
  // FIXME (jsingh) deprecate value. Only needed to allow mix of V1 and V2
  value?: string,
  // FIXME (jsingh) deprecate values support of SearchOptionValues. Should only be strings.
  values: Array<string>,
} & SearchDef;

declare type SearchOptionsV2 = Array<SearchOptionV2>;

declare type SearchApi = {
  searchDefs: SearchDefs,
  setSearchOptions: Function,
};

type OmniSearchCommand = {
  command: string,
  omniFieldName: string,
  omniValues?: Array<string>,
};
