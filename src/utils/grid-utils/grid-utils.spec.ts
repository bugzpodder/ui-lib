import { getColHeader, getGridCellPosition, getRowHeader } from "./grid-utils";
import { upperAlphaChars } from "../string-utils";

describe("getRowHeader", () => {
  it("should get row header", () => {
    expect(getRowHeader(0)).toEqual("A");
  });

  it("should error when provided with erroneous index", () => {
    expect(() => getRowHeader(-1)).toThrowError();
    expect(() => getRowHeader(upperAlphaChars.length * 26)).toThrowError();
  });
});

describe("getColHeader", () => {
  it("should get column header", () => {
    expect(getColHeader(0)).toEqual("1");
  });
});

describe("getGridCellPosition", () => {
  it("should get grid cell position", () => {
    expect(getGridCellPosition(0, 0)).toEqual("A1");
  });
});
