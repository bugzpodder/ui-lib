//@flow
import { LIKE_TEXT_SEARCH_TYPE, MULTI_FIELD_TEXT_SEARCH_TYPE } from "@grail/lib";

import { getOmniTextFromSearchValues, getSearchValuesFromOmniText, getSearchOptions } from "./omni-search-util";

const searchDefs: SearchDefs = [
	{
		name: "Part Number",
		type: LIKE_TEXT_SEARCH_TYPE,
		description: "e.g. G0000",
		searchFields: ["part"],
	},
	{
		name: "Lot Number",
		type: MULTI_FIELD_TEXT_SEARCH_TYPE,
		aliases: ["lot"],
		description: "Lot Num/External Ref",
		searchFields: ["lotNumber", "externalReference"],
	},
];

describe("getOmniTextFromSearchValues", () => {
	it("converts search values with whitespace to quotes", () => {
		const searchValues = new Map();
		searchValues.set(0, "1");
		searchValues.set(1, "12 34");
		const expectedOmniText = '1 lot:"12 34"';
		expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
	});
	it("accepts arrays", () => {
		const searchValues = new Map();
		searchValues.set(0, "1");
		searchValues.set(1, ["34", "12"]);
		const expectedOmniText = "1 lot:[34, 12]";
		expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
	});
	it("skips null values", () => {
		const searchValues = new Map();
		searchValues.set(0, null);
		searchValues.set(1, ["34", null]);
		const expectedOmniText = "lot:[34, ]";
		expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
	});
	it("skips empty arrays", () => {
		const searchValues = new Map();
		searchValues.set(0, []);
		searchValues.set(1, ["34", null]);
		const expectedOmniText = "lot:[34, ]";
		expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
	});
});

describe("getSearchValuesFromOmniText", () => {
	it("should join values of duplicate keys", () => {
		const expectedSearchValues = new Map();
		expectedSearchValues.set(0, ["1", "5"]);
		expectedSearchValues.set(1, ["12", "34"]);
		expect(getSearchValuesFromOmniText(searchDefs, "lot:12 1 lot: 34 part:5")).toEqual(expectedSearchValues);
	});
	it("accepts multiple values under the same key", () => {
		const expectedSearchValues = new Map();
		expectedSearchValues.set(0, "1");
		expectedSearchValues.set(1, ["34", "12"]);
		expect(getSearchValuesFromOmniText(searchDefs, "lotNumber: [34, 12] 1 ")).toEqual(expectedSearchValues);
	});
	it("errors for keys", () => {
		expect(() => getSearchValuesFromOmniText(searchDefs, "lotNmber:12 1 lot: 34")).toThrowError();
	});
	it("returns empty map with invalid arguments", () => {
		const expectedSearchValues = new Map();
		expect(getSearchValuesFromOmniText(searchDefs, "")).toEqual(expectedSearchValues);
		expect(getSearchValuesFromOmniText(null, "foobar")).toEqual(expectedSearchValues);
	});
});

describe("getSearchOptions", () => {
	const expectedSearchOptions = [
		{
			name: "Part Number",
			type: LIKE_TEXT_SEARCH_TYPE,
			description: "e.g. G0000",
			searchFields: ["part"],
			value: "1",
		},
		{
			name: "Lot Number",
			type: MULTI_FIELD_TEXT_SEARCH_TYPE,
			aliases: ["lot"],
			description: "Lot Num/External Ref",
			searchFields: ["lotNumber", "externalReference"],
			value: "2",
		},
	];
	const searchValues = new Map();
	searchValues.set(0, "1");
	searchValues.set(1, "2");
	it("should create search options properly", () => {
		expect(getSearchOptions(searchDefs, searchValues)).toEqual(expectedSearchOptions);
	});
});
