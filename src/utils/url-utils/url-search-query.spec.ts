import { getSearchValues, updateSearchUrl } from "./url-search";

jest.useFakeTimers();

const singleValues = ["testString", 0, 2.1727, false, true];
const arrayValues = [
  ["a", "testString"],
  [0, Math.E, -Math.PI],
  [false, true],
];
const placeholder = "Dummy Field";

const generateValueSearchQuery = (key, value): string =>
  `?${key}=${String(value)}`;
const generateValuesSearchQuery = (key, values): string => {
  const result = values.reduce(
    (acc, value, index) => `${acc}${key}%5B${index}%5D=${String(value)}&`,
    "?",
  );
  if (result.length > 1) {
    return result.substring(0, result.length - 1);
  }
  return result;
};

describe("getSearchValues", () => {
  it("handles no search values", () => {
    const location = {
      pathname: "/some/route",
      search: "",
      hash: "#",
    };
    expect(getSearchValues({ location: location as any })).toEqual(new Map());
  });
  singleValues.forEach((value) => {
    const location = {
      pathname: "/some/route",
      search: generateValueSearchQuery("test", value),
      hash: "#",
    };
    it(`handles ${String(value)} search value`, () => {
      expect(getSearchValues({ location: location as any })).toEqual(
        new Map().set("test", { values: [String(value)] }),
      );
    });
  });
  arrayValues.forEach((values) => {
    const testValues = (values as any[]).map((value) => String(value));
    const location = {
      pathname: "/some/route",
      search: generateValuesSearchQuery("test", testValues),
      hash: "#",
    };
    it(`handles array ${String(values)} search values`, () => {
      expect(getSearchValues({ location: location as any })).toEqual(
        new Map().set("test", { values: testValues }),
      );
    });
  });
});

describe("updateSearchUrl", () => {
  const location = {
    pathname: "/some/route",
    search: "",
    hash: "#",
  };
  it("handles no search values", () => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    updateSearchUrl({
      location: location as any,
      history: history as any,
      searchOptions: new Map(),
    });
    jest.runAllTimers();
    expect(history.replace).not.toBeCalled();
    expect(history.push).not.toBeCalled();
  });
  singleValues.forEach((value) => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    it(`handles ${String(value)} search value`, () => {
      updateSearchUrl({
        location: location as any,
        history: history as any,
        searchOptions: new Map().set("test", { values: [value], placeholder }),
      });
      jest.runAllTimers();
      expect(history.replace).toBeCalledWith({
        search: generateValueSearchQuery("test", value),
      });
    });
  });
  arrayValues.forEach((values) => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    it(`handles array ${String(values)} search values`, () => {
      updateSearchUrl({
        location: location as any,
        history: history as any,
        searchOptions: new Map().set("test", { values, placeholder }),
      });
      jest.runAllTimers();
      const search = generateValuesSearchQuery("test", values);
      expect(history.replace).toBeCalledWith({ search });
    });
  });
});
