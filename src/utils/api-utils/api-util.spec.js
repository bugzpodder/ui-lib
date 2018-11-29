// @flow
import "../mocks";
import {
  BOOLEAN_SEARCH_TYPE,
  DATETIME_SEARCH_TYPE,
  DATE_SEARCH_TYPE,
  FULL_ID_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_ID_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  MULTI_FIELD_TEXT_SEARCH_TYPE,
  NUMERIC_SEARCH_TYPE,
} from "./api-constants";
import { filterResults } from "./api-util";

const testSimple = [{ id: 1 }, { id: 5 }, { id: 2 }, { id: 4 }, { id: 3 }, { id: 0 }];
const testObjs = [{ name: "xx" }, { name: "xy" }, { name: "aa" }, { name: "bb" }, { name: "bx" }];

const testObjs2 = [{ name: "xx" }, { name: "xy" }, { name: "xy" }, { name: "bb" }, { name: "aa" }];

const testObjs3 = [{ name: "x" }, { name: "x" }, { name: "b" }, { name: "b" }, { name: "a" }];

const testDates = [
  { date: "2017-08-23" },
  { date: "2017-10-02" },
  { date: "2017-10-03" },
  { date: "2017-10-30" },
  { date: "2017-11-23" },
];

const testMulti = [
  { id: "aa", name: "xx" },
  { id: "bb", name: "xy" },
  { id: "cc", name: "aa" },
  { id: "dd", name: "bb" },
  { id: "ee", name: "bx" },
];

const testId = [
  { id: "P001001", name: "xx" },
  { id: "bb", name: "A00100-1" },
  { id: "A00100-1", name: "aa" },
  { id: "dd", name: "P001001" },
  { id: "ee", name: "P001002" },
];

const testNested = [
  { labels: [{ name: "bx" }, { name: "aa" }] },
  { labels: [{ name: "bb" }] },
  { labels: [{ name: "gg" }] },
  { labels: [] },
  { labels: [{ name: "gg" }, { name: "bg" }] },
];

const testNestedMulti = [
  { name: "bb", labels: [{ name: "bx" }, { name: "aa" }] },
  { name: "gg", labels: [{ name: "bb" }] },
  { name: "xy", labels: [{ name: "gg" }] },
  { name: "ab", labels: [] },
  { name: "cd", labels: [{ name: "gg" }, { name: "bg" }] },
];

const testNestedNumeric = [
  { values: [{ count: 10 }, { count: 3 }] },
  { values: [{ count: 10 }, { count: 30 }] },
  { values: [] },
  { values: [{ count: 30 }] },
  { values: [{ count: 8 }] },
];

const testNestedBoolean = [
  { values: [{ isValid: 1 }, { isValid: false }] },
  { values: [{ isValid: true }, { isValid: 1 }] },
  { values: [] },
  { values: [{ isValid: true }] },
  { values: [{ isValid: false }] },
];

const testNestedId = [
  { name: "bb", labels: [{ name: "P001001" }, { name: "aa" }] },
  { name: "P001001", labels: [{ name: "bb" }] },
  { name: "xy", labels: [{ name: "A00100-1" }] },
  { name: "A00100-1", labels: [] },
  { name: "cd", labels: [{ name: "P001002" }, { name: "bg" }] },
];

const testBoolean = [{ isValid: true }, { isValid: false }, { isValid: 1 }, { isValid: 0 }, {}];

const checkResult = (input, options) => {
  const output = filterResults(input, options);
  expect({ options, input, output }).toMatchSnapshot();
};

describe("filterResults", () => {
  it("should be identity", () => {
    const options = {
      count: 10,
      offset: 0,
      sortOptions: [],
      searchOptions: [],
    };
    checkResult([1, 5, 3, 2, 4], options);
  });

  it("should limit", () => {
    const options = {
      count: 3,
      offset: 0,
      sortOptions: [],
      searchOptions: [],
    };
    checkResult([1, 2, 3, 4, 5], options);
  });

  it("should offset", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [],
      searchOptions: [],
    };
    checkResult([1, 2, 3, 4, 5], options);
  });

  it("should sort", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [{ id: "id" }],
      searchOptions: [],
    };
    checkResult(testSimple, options);
  });

  it("should sort desc", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [{ id: "id", desc: true }],
      searchOptions: [],
    };
    checkResult(testSimple, options);
  });

  it("should sort and offset", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [{ id: "id" }],
      searchOptions: [],
    };
    checkResult(testSimple, options);
  });

  it("should multi-sort", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [{ id: "name" }, { id: "id" }],
      searchOptions: [],
    };
    checkResult(testObjs3, options);
  });

  it("should sort desc and offset", () => {
    const options = {
      count: 5,
      offset: 3,
      sortOptions: [{ id: "id", desc: true }],
      searchOptions: [],
    };
    checkResult(testSimple, options);
  });

  it("should not filter undefined", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          value: undefined,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs3, options);
  });

  it("should filter number", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          value: 3,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testSimple, options);
  });

  it("should filter equal number", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          value: 3,
          type: NUMERIC_SEARCH_TYPE,
          isEqual: true,
        },
      ],
    };
    checkResult(testSimple, options);
  });

  it("should filter unequal number", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          value: 3,
          type: NUMERIC_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testSimple, options);
  });

  it("should filter many numbers", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          values: [3, 4],
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testSimple, options);
  });

  it("should filter zero", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          value: 0,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testSimple, options);
  });

  it("should not filter empty string", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "",
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs3, options);
  });

  it("should filter string", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "xy",
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs2, options);
  });

  it("should filter many strings", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          values: ["xy", "aa"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs2, options);
  });

  it("should filter string for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "bb",
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter many strings for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          values: ["bb", "gg"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter unequal string for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "bb",
          type: FULL_TEXT_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter many unequal strings for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          values: ["bg", "gg"],
          type: FULL_TEXT_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter substring", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter unequal substring", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should not filter empty substring", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs3, options);
  });

  it("should filter substring for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "b",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter many substrings for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          values: ["a", "g"],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter unequal substring for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "b",
          type: LIKE_TEXT_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter many unequal substrings for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          values: ["b", "g"],
          type: LIKE_TEXT_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNested, options);
  });

  it("should filter numeric for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.count",
          value: 10,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedNumeric, options);
  });

  it("should filter multi numeric for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.count",
          values: [10, 30],
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedNumeric, options);
  });

  it("should filter unequal numeric for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.count",
          value: 30,
          type: NUMERIC_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNestedNumeric, options);
  });

  it("should filter true for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.isValid",
          value: true,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedBoolean, options);
  });

  it("should filter false for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.isValid",
          value: false,
          type: BOOLEAN_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedBoolean, options);
  });

  it("should filter unequal boolean for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.isValid",
          value: true,
          isEqual: false,
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedBoolean, options);
  });

  it("should filter unequal numeric for nested", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "values.count",
          value: 30,
          type: NUMERIC_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testNestedNumeric, options);
  });

  it("should filter true boolean", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "isValid",
          value: true,
          type: BOOLEAN_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testBoolean, options);
  });

  it("should filter false boolean", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "isValid",
          value: false,
          type: BOOLEAN_SEARCH_TYPE,
          isEqual: false,
        },
      ],
    };
    checkResult(testBoolean, options);
  });

  it("should filter multi-field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "omni",
          value: "aa",
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["id", "name"],
        },
      ],
    };
    checkResult(testMulti, options);
  });

  it("should filter many multi-fields", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "omni",
          values: ["aa", "bb"],
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["id", "name"],
        },
      ],
    };
    checkResult(testMulti, options);
  });

  it("should filter empty multi-field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "omni",
          value: "",
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["id", "name"],
        },
      ],
    };
    checkResult(testMulti, options);
  });

  it("should filter nested multi-field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "omni",
          value: "bb",
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["name", "labels.name"],
        },
      ],
    };
    checkResult(testNestedMulti, options);
  });

  it("should filter many nested multi-fields", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "omni",
          values: ["ab", "bb"],
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["name", "labels.name"],
        },
      ],
    };
    checkResult(testNestedMulti, options);
  });

  it("should filter start datetime", () => {
    const date = "2017-10-03T16:20:00.000Z";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [date],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter end date with empty string startDate", () => {
    const date = "2017-10-03T16:20:00.000Z";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [`to ${date}`],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter start and end datetime", () => {
    const date = "2017-10-03T16:20:00.000Z";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [`2017-09-01 to ${date}`],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should not filter without datetime", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should not filter missing datetime", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "missingDate",
          values: ["2017-10-03 to 2017-10-30"],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter start date", () => {
    const date = "2017-10-03";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [date],
          type: DATE_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter end date with empty string startDate", () => {
    const date = "2017-10-03";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [`to ${date}`],
          type: DATE_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter start and end date", () => {
    const date = "2017-10-03";
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [`2017-09-01 to ${date}`],
          type: DATE_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should not filter without date", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: [],
          type: DATE_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should not filter missing date", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "missingDate",
          values: ["2017-10-03 to 2017-10-03"],
          type: DATE_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should return true if no values", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter results for reverse start and end date", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "date",
          values: ["2018-10-03 to 2017-10-03"],
          type: DATETIME_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testDates, options);
  });

  it("should filter multi search", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
        {
          name: "id",
          values: [1, 3, 5],
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter multi search with empty value", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
        {
          name: "id",
          values: [1, 3, 5],
          type: NUMERIC_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter multi search with starting empty value", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "id",
          values: [1, 3, 5],
          type: NUMERIC_SEARCH_TYPE,
        },
        {
          name: "name",
          value: "",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter then offset", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter then sort", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [{ id: "name" }],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should filter then sort then offset", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [{ id: "name" }],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testObjs, options);
  });

  it("should throw an error for an unknown search type", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [{ id: "name" }],
      searchOptions: [
        {
          name: "name",
          value: "x",
          type: "INVALID",
        },
      ],
    };
    expect(() => filterResults(testNestedMulti, options)).toThrowError();
  });

  it("should throw error for filterkey if with invalid type", () => {
    const options = {
      count: 2,
      offset: 1,
      sortOptions: [{ id: "name" }],
      searchOptions: [
        {
          name: "labels.name",
          value: "x",
          type: "INVALID",
        },
      ],
    };
    expect(() => filterResults(testNestedMulti, options)).toThrowError();
  });

  it("should filter id field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "P00100-1",
          type: FULL_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testId, options);
  });
  it("should filter lab test accession label id field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "A00100-1",
          type: FULL_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testId, options);
  });
  it("should filter like id field", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "name",
          value: "P001",
          type: LIKE_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testId, options);
  });
  it("should filter id field with filterKey", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "P00100-1",
          type: FULL_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedId, options);
  });
  it("should filter lab test accession label id field with filterKey", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "A00100-1",
          type: FULL_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedId, options);
  });
  it("should filter like id field with filterKey", () => {
    const options = {
      count: 5,
      offset: 0,
      sortOptions: [],
      searchOptions: [
        {
          name: "labels.name",
          value: "P001",
          type: LIKE_ID_SEARCH_TYPE,
        },
      ],
    };
    checkResult(testNestedId, options);
  });
});
