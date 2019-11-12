import mockConsole from "jest-mock-console";

import {
  expandSearchValues,
  extractSearchValues,
  flattenSearchValues,
  getOmniUrlQueryString,
  mergeSearchOptions,
} from "./url-search";

const singleValues = ["test string", 0, 2.1727, false, true];
const arrayValues = [
  ["a", "test string"],
  [0, Math.E, -Math.PI],
  [false, true],
  [null, "test"],
];
const placeholder = "Dummy Field";

const undefinedSearchValues = new Map().set("test", {
  value: undefined,
  values: undefined,
});

describe("flattenSearchValues", () => {
  it("handles no search values", () => {
    expect(flattenSearchValues(new Map())).toEqual({});
  });
  it("returns false if values are null or undefined", () => {
    expect(flattenSearchValues(undefinedSearchValues)).toEqual({});
  });
  singleValues.forEach(value => {
    it(`handles ${String(value)} search value`, () => {
      expect(flattenSearchValues(new Map().set("test", { value }))).toEqual({
        test: value,
      });
    });
  });
  arrayValues.forEach(values => {
    it(`handles array ${String(values)} search values`, () => {
      expect(flattenSearchValues(new Map().set("test", { values }))).toEqual({
        test: values,
      });
    });
  });
});

describe("expandSearchValues", () => {
  it("handles no search values", () => {
    expect(expandSearchValues({})).toEqual(new Map());
  });
  it("handles error", () => {
    mockConsole();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: expected 1 argument.
    expect(expandSearchValues()).toEqual(new Map());
    expect(console.error).toHaveBeenCalled();
  });
  singleValues.forEach(value => {
    it(`handles ${String(value)} search value`, () => {
      expect(expandSearchValues({ test: value })).toEqual(
        new Map().set("test", { value }),
      );
    });
  });
  arrayValues.forEach(values => {
    it(`handles array ${String(values)} search values`, () => {
      expect(expandSearchValues({ test: values })).toEqual(
        new Map().set("test", { values }),
      );
    });
  });
});

describe("extractSearchValues", () => {
  it("handles no search values", () => {
    expect(extractSearchValues(new Map())).toEqual(new Map());
  });
  singleValues.forEach(value => {
    it(`handles ${String(value)} search value`, () => {
      expect(
        extractSearchValues(new Map().set("test", { value, placeholder })),
      ).toEqual(new Map().set("test", { value }));
    });
  });
  arrayValues.forEach(values => {
    it(`handles array ${String(values)} search values`, () => {
      const expectedValues = (values as any[]).filter(value => value !== null);
      expect(
        extractSearchValues(new Map().set("test", { values, placeholder })),
      ).toEqual(
        new Map().set("test", { value: undefined, values: expectedValues }),
      );
    });
  });
  it("handles array with undefined search values", () => {
    const values: string[] = [];
    values[2] = "value 1";
    const expectedValues = [values[2]];
    expect(
      extractSearchValues(new Map().set("test", { values, placeholder })),
    ).toEqual(
      new Map().set("test", { value: undefined, values: expectedValues }),
    );
  });
});

describe("mergeSearchOptions", () => {
  it("handles no search values", () => {
    expect(mergeSearchOptions(new Map(), new Map())).toEqual(new Map());
  });
  it("handles invalid search values", () => {
    expect(mergeSearchOptions(new Map())).toEqual(new Map());
  });
  singleValues.forEach(value => {
    it("merges no search values into empty search options", () => {
      expect(
        mergeSearchOptions(new Map(), new Map().set("test", { value })),
      ).toEqual(new Map());
    });
  });
  singleValues.forEach(value => {
    it("merges no search values into mismatched search options", () => {
      const searchOptions = new Map().set("test2", { placeholder });
      expect(
        mergeSearchOptions(searchOptions, new Map().set("test", { value })),
      ).toEqual(searchOptions);
    });
  });
  singleValues.forEach(value => {
    it(`handles ${String(value)} search value`, () => {
      expect(
        mergeSearchOptions(
          new Map().set("test", { placeholder }),
          new Map().set("test", { value }),
        ),
      ).toEqual(new Map().set("test", { placeholder, value }));
    });
  });
  arrayValues.forEach(values => {
    it(`handles array ${String(values)} search values`, () => {
      expect(
        mergeSearchOptions(
          new Map().set("test", { placeholder }),
          new Map().set("test", { values }),
        ),
      ).toEqual(new Map().set("test", { placeholder, values }));
    });
  });
});

describe("getOmniUrlQueryString", () => {
  it("should get url query", () => {
    const test = getOmniUrlQueryString([{ key: "test", value: "name" }]);
    expect(test).toBe("omni=test%3A%20name");
  });
});
