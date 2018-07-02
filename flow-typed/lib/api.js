// Sort Options:
declare type SortOption = { id: string, desc?: boolean };
declare type SortOptions = Array<SortOption>;

// Search Options. Used by API calls to build the query:
declare type SearchOptionValueItem = string | number | boolean | null;
declare type SearchOptionValue = {
	value?: SearchOptionValueItem,
	values?: Array<SearchOptionValueItem>,
};
declare type SearchOptionValues = Map<string, SearchOptionValue>;

declare type SearchOption = {
	type?: Symbol,
	rawQuery?: string,
	searchFields?: Array<string>,
	isEqual?: boolean,
	isCustomRendered?: boolean,
	placeholder?: string,
	searchOperator?: Symbol,
} & SearchOptionValue;

declare type SearchOptions = Map<string, SearchOption>;
declare type LegacySearchOptions = { [string]: SearchOption };
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

// PagedTableOptions requires all parameters. It is for paged tables (offset, count, sort, selection)
declare type PagedTableOptions = {
	sortOptions: SortOptions,
} & PaginationOptions;

declare type LegacyApiQueryOptions = {
	searchOptions: SearchOptions,
	selectedRowIds: Array<any>,
	isLoading: boolean,
} & PagedTableOptions;

declare type ApiQueryOptions = {
	searchOptions: SearchOptionsV2,
	selectedRowIds: Array<any>,
	isLoading: boolean,
} & PagedTableOptions;

// Search Definitions. Used by OmniSearch to build the UI. Used to build SearchOptions:
type SearchFieldProps = {
	searchKey: string,
	searchValue: ?string,
	onChange: (string, any) => any,
	placeholder?: string,
	searchType?: Symbol,
};

declare type SearchDef = {
	name: string,
	type: Symbol,
	searchFields: Array<string>,
	Component?: React$StatelessFunctionalComponent<SearchFieldProps>,
	aliases?: Array<string>,
	description?: string,
	searchOperator?: string,
	localStorageKey?: string,
	// TODO(jrosenfield): support validation in the future?
};

declare type SearchDefs = Array<SearchDef>;

declare type SearchValues = Map<number, string>;

declare type SearchOptionV2 = {
	value: Array<string>,
} & SearchDef;

declare type SearchOptionsV2 = Array<SearchOptionV2>;

declare type SearchApi = {
	searchDefs: SearchDefs,
	setSearchOptions: Function,
};
