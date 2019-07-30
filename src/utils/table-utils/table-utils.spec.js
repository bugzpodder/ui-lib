// @flow

import { getAccessors, toDelimitedReport } from "./table-utils";

const columns = [
  {
    accessor: "abc",
  },
  {
    accessor: "123",
    exportHeaderName: "ONE_TWO_THREE",
  },
  {
    accessor: datum => datum.accessibleValue,
  },
];

describe("getAccessors", () => {
  it("gets accessors", () => {
    expect(getAccessors(columns)).toEqual(["abc", "123", columns[2].accessor]);
  });
  it("replaces missing accessor with empty string", () => {
    expect(getAccessors([...columns, {}])).toEqual(["abc", "123", columns[2].accessor, ""]);
  });
});

/**
In order to compare output from `toDelimitedReport`, it is easier to compare test failure logs if we replace
all <enter> keys with <ENTER>  Because whitespaces are not obvious in the test diffs, etc
*/
const expectWithEnter = expected => expect(expected.replace(/\n/g, "<ENTER>"));

describe("toDelimitedReport", () => {
  const data = [
    {
      123: "Value 1",
      abc: "Other Value 1",
      accessibleValue: "function accessor 1",
    },
    {
      123: "Value 2",
      abc: 0, // Intentionally falsey test case
      accessibleValue: "function accessor 2",
    },
  ];
  it("generates a delimited string", () => {
    expectWithEnter(toDelimitedReport(columns, data)).toEqual(
      "abc,ONE_TWO_THREE,2<ENTER>Other Value 1,Value 1,function accessor 1<ENTER>0,Value 2,function accessor 2<ENTER>",
    );
  });
  it("adds empty column when missing an accessor", () => {
    const delimitedString = toDelimitedReport([...columns, {}], data);
    expectWithEnter(delimitedString).toEqual(
      "abc,ONE_TWO_THREE,2,<ENTER>Other Value 1,Value 1,function accessor 1,<ENTER>0,Value 2,function accessor 2,<ENTER>",
    );
  });
  it("test empty data array", () => {
    const data = [];
    expectWithEnter(toDelimitedReport(columns, data)).toEqual("abc,ONE_TWO_THREE,2<ENTER>");
  });
  it("test empty columns array", () => {
    const columns = [];
    expectWithEnter(toDelimitedReport(columns, data)).toEqual("<ENTER><ENTER><ENTER>");
  });
  it("test different delimiter", () => {
    const option = { delimiter: "x" };
    expectWithEnter(toDelimitedReport(columns, data, option)).toEqual(
      "abcxONE_TWO_THREEx2<ENTER>Other Value 1xValue 1xfunction accessor 1<ENTER>0xValue 2xfunction accessor 2<ENTER>",
    );
  });
});
