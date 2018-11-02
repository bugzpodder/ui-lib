// @flow
import {
  ENUM_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  OMNI_TEXT_SEARCH_TYPE,
} from "../api-utils/api-constants";

import {
  getItemsFromOmniValue,
  getOmniTextFromKeyValues,
  getOmniTextFromSearchValues,
  getSearchOptions,
  getSearchValuesFromOmniText,
  getValueItemsFromSearchValues,
} from "./omni-search-util";

const searchDefs: SearchDefs = [
  {
    name: "omni",
    type: OMNI_TEXT_SEARCH_TYPE,
    description: "e.g. G0000",
    searchFields: ["part", "lotNumber"],
  },
  {
    name: "Part Number",
    type: LIKE_TEXT_SEARCH_TYPE,
    description: "e.g. G0000",
    searchFields: ["part"],
  },
  {
    name: "Lot Number",
    type: FULL_TEXT_SEARCH_TYPE,
    aliases: ["lot"],
    description: "Lot Num/Vendor Lot Num",
    searchFields: ["lotNumber", "vendorLotNumber"],
  },
  {
    name: "Some Enum",
    type: ENUM_SEARCH_TYPE,
    aliases: ["someEnum"],
    description: "Lot Num/Vendor Lot Num",
    searchFields: ["anEnum"],
  },
];

describe("getOmniTextFromSearchValues", () => {
  it("accepts stringified arrays", () => {
    const searchValues = new Map();
    searchValues.set(0, "1");
    searchValues.set(2, "34, 12");
    const expectedOmniText = "1 lot:34, 12";
    expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
  });
  it("skips missing values", () => {
    const searchValues = new Map();
    searchValues.set(2, "34,");
    const expectedOmniText = "lot:34,";
    expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
  });
  it("skips empty strings", () => {
    const searchValues = new Map();
    searchValues.set(0, "");
    searchValues.set(2, "34,");
    const expectedOmniText = "lot:34,";
    expect(getOmniTextFromSearchValues(searchDefs, searchValues)).toEqual(expectedOmniText);
  });
});

describe("getOmniTextFromKeyValues", () => {
  it("accepts stringified arrays", () => {
    const keyValues = [
      {
        key: "part",
        value: "1",
      },
      {
        key: "lot",
        value: "34, 12",
      },
    ];
    const expectedOmniText = "part:1 lot:34, 12";
    expect(getOmniTextFromKeyValues(keyValues)).toEqual(expectedOmniText);
  });
});

describe("getSearchValuesFromOmniText", () => {
  it("should join values of duplicate keys", () => {
    const expectedSearchValues = new Map();
    expectedSearchValues.set(1, "5");
    expectedSearchValues.set(2, "12 1, 34");
    expect(getSearchValuesFromOmniText(searchDefs, "lot:12 1 lot: 34 part:5")).toEqual(expectedSearchValues);
  });
  it("should trim whitespace for ENUM_SEARCH_TYPE", () => {
    const expectedSearchValues = new Map();
    expectedSearchValues.set(3, "ABC");
    expect(getSearchValuesFromOmniText(searchDefs, "someEnum:  ABC")).toEqual(expectedSearchValues);
  });
  // it("accepts multiple values under the same key", () => {
  //   const expectedSearchValues = new Map();
  //   expectedSearchValues.set(0, "1");
  //   expectedSearchValues.set(1, ["34", "12"]);
  //   expect(getSearchValuesFromOmniText(searchDefs, "lotNumber: [34, 12] 1 ")).toEqual(expectedSearchValues);
  // });
  it("errors for invalid keys", () => {
    expect(() => getSearchValuesFromOmniText(searchDefs, "lotNmber:12 1 lot: 34")).toThrowError();
  });
  it("errors for invalid text", () => {
    expect(() => getSearchValuesFromOmniText(searchDefs, ":::::")).toThrowError();
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
      values: ["1"],
    },
    {
      name: "Lot Number",
      type: FULL_TEXT_SEARCH_TYPE,
      aliases: ["lot"],
      description: "Lot Num/Vendor Lot Num",
      searchFields: ["lotNumber", "vendorLotNumber"],
      values: ["2", "", "3", "4"],
    },
  ];
  const searchValues = new Map();
  searchValues.set(1, "1");
  searchValues.set(2, "2,,3,4");
  it("should create search options properly", () => {
    expect(getSearchOptions(searchDefs, searchValues)).toEqual(expectedSearchOptions);
  });
  const invalidSearchValues = new Map().set(32, "1");
  it("should create search options properly", () => {
    expect(getSearchOptions(searchDefs, invalidSearchValues)).toEqual([]);
  });
});

describe("getItemsFromOmniValue", () => {
  it("can handle null/undfined args", () => {
    expect(getItemsFromOmniValue()).toEqual([]);
  });
  it("splits on comma and trims spaces", () => {
    expect(getItemsFromOmniValue(" 12 1,  34")).toEqual(["12 1", "34"]);
  });
  // TODO(jrosenfield): add more testing coverage
});

describe("getValueItemsFromSearchValues", () => {
  const searchValues = new Map();
  searchValues.set(1, "1");
  searchValues.set(2, "2,,3,4");
  it("gets no search values for no matching key", () => {
    expect(getValueItemsFromSearchValues(searchDefs, searchValues, "unknownKey")).toEqual([]);
  });
  it("gets no search values for no matching value", () => {
    expect(getValueItemsFromSearchValues(searchDefs, searchValues, "anEnum")).toEqual([]);
  });
  it("gets search values for matching key", () => {
    expect(getValueItemsFromSearchValues(searchDefs, searchValues, "lot")).toEqual(["2", "", "3", "4"]);
  });
});
