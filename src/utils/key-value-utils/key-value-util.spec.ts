import forEach from "lodash/forEach";

import { hasKey, hasKeyValue, setKeyValue } from "./key-value-util";

const setKeyValueTestCases = [
  {
    initial: [],
    newEntry: { key: "foo", value: "bar" },
    expectedResult: [{ key: "foo", value: "bar" }],
  },
  {
    initial: [{ key: "foo", value: "foo" }],
    newEntry: { key: "foo", value: "bar" },
    expectedResult: [{ key: "foo", value: "bar" }],
  },
  {
    initial: [{ key: "foo", value: "bar" }],
    newEntry: { key: "baz", value2: "bot" },
    expectedResult: [
      { key: "foo", value: "bar" },
      { key: "baz", value2: "bot" },
    ],
  },
  {
    initial: [{ key: "foo", value: "bar" }, { key: "baz", value: "bat" }],
    newEntry: { key: "baz", value2: "boo" },
    expectedResult: [
      { key: "foo", value: "bar" },
      { key: "baz", value2: "boo" },
    ],
  },
];

describe("setKeyValue", () => {
  forEach(
    setKeyValueTestCases,
    (
      testCase: {
        [x: string]: any;
      },
      index: number,
    ) => {
      const { initial, newEntry, expectedResult } = testCase;
      const actual = initial.slice();
      setKeyValue(actual, newEntry);
      it(`setKeyValue test case ${index} add new entry '${JSON.stringify(
        newEntry,
      )}'`, () => {
        expect(actual).toEqual(expectedResult);
      });
    },
  );
});

describe("hasKeyValue", () => {
  const { initial } = setKeyValueTestCases[1];
  const actual = hasKeyValue(initial, "foo", "foo");
  it("should have key value", () => {
    expect(actual).toEqual(true);
  });
});

describe("hasKey", () => {
  const { initial } = setKeyValueTestCases[1];
  const actual = hasKey(initial, "foo");
  it("should have key", () => {
    expect(actual).toEqual(true);
  });
});
