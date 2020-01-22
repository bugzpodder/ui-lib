import "../mocks";
import {
  boolToString,
  buildOrderQuery,
  getPage,
  isValueValid,
} from "./api-util";

describe("getOverride", () => {
  it("should give '0' for false", () => {
    expect(boolToString(false)).toEqual("0");
  });
  it("should give '1' for true", () => {
    expect(boolToString(true)).toEqual("1");
  });
});

describe("getPage", () => {
  it("should give page for 0 offset", () => {
    expect(getPage(0, 5)).toEqual(1);
  });
  it("should give page for 5th page offset", () => {
    expect(getPage(20, 5)).toEqual(5);
  });
  it("should give the first page by default", () => {
    expect(getPage()).toEqual(1);
  });
  it("should give the default page when only offset is given", () => {
    expect(getPage(10)).toEqual(2);
  });
});

describe("isValueValid", () => {
  [
    0,
    -1,
    1,
    Infinity,
    42,
    3.1415926535,
    "test",
    true,
    false,
    "A sentence",
    " ",
  ].forEach(value => {
    it(`should validate '${String(value)}'`, () =>
      expect(isValueValid(value)).toBe(true));
  });
  ["", null, undefined].forEach(value => {
    it(`should invalidate '${String(value)}'`, () =>
      expect(isValueValid(value)).toBe(false));
  });
});

describe("buildOrderQuery", () => {
  it("should generate no query for no sortOptions", () => {
    expect(buildOrderQuery()).toEqual("");
  });
  it("should return if no id", () => {
    expect(buildOrderQuery([{}] as any)).toEqual("");
  });
  it("should generate query for one sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column" }])).toEqual("column ASC");
  });
  it("should generate query for one ascending sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column", desc: false }])).toEqual(
      "column ASC",
    );
  });
  it("should generate query for one descending sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column", desc: true }])).toEqual(
      "column DESC",
    );
  });
  it("should generate query for mixed sortOptions elements", () => {
    expect(
      buildOrderQuery([
        { id: "column1" },
        { id: "column2", desc: false },
        { id: "column3", desc: true },
      ]),
    ).toEqual("column1 ASC, column2 ASC, column3 DESC");
  });
});
