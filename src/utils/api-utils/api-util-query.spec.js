// @flow
import "../mocks";
import { buildOrderQuery, getPage, isValueValid } from "@grail/lib";

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
  [0, -1, 1, Infinity, 42, 3.1415926535, "test", true, false, "A sentence", " "].forEach(value => {
    it(`should validate '${String(value)}'`, () => expect(isValueValid(value)).toBe(true));
  });
  ["", null, undefined].forEach(value => {
    it(`should invalidate '${String(value)}'`, () => expect(isValueValid(value)).toBe(false));
  });
});

describe("buildOrderQuery", () => {
  it("should generate no query for no sortOptions", () => {
    expect(buildOrderQuery()).toEqual("");
  });
  it("should return if no id", () => {
    expect(buildOrderQuery([{}])).toEqual("");
  });
  it("should generate query for one sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column" }])).toEqual("&order=column ASC");
  });
  it("should generate query for one ascending sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column", desc: false }])).toEqual("&order=column ASC");
  });
  it("should generate query for one descending sortOptions element", () => {
    expect(buildOrderQuery([{ id: "column", desc: true }])).toEqual("&order=column DESC");
  });
  it("should generate query for mixed sortOptions elements", () => {
    expect(buildOrderQuery([{ id: "column1" }, { id: "column2", desc: false }, { id: "column3", desc: true }])).toEqual(
      "&order=column1 ASC, column2 ASC, column3 DESC",
    );
  });
});
