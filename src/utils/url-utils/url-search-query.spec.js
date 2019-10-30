// @flow
import { getSearchValues, updateSearchUrl } from "./url-search";

const singleValues = ["testString", 0, 2.1727, false, true];
const arrayValues = [["a", "testString"], [0, Math.E, -Math.PI], [false, true]];
const placeholder = "Dummy Field";

const generateValueSearchQuery = (key, value) => `?${key}=${String(value)}`;
const generateValuesSearchQuery = (key, values) => {
  const result = values.reduce(
    (acc, value, index) => `${acc}${key}%5B${index}%5D=${String(value)}&`,
    "?",
  );
  if (result.length > 1) {
    return result.substring(0, result.length - 1);
  }
  return result;
};

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

describe("getSearchValues", () => {
  it("handles no search values", () => {
    const location: Location = {
      pathname: "/some/route",
      search: "",
      hash: "#",
    };
    expect(getSearchValues({ location })).toEqual(new Map());
  });
  singleValues.forEach(value => {
    const location: Location = {
      pathname: "/some/route",
      search: generateValueSearchQuery("test", value),
      hash: "#",
    };
    it(`handles ${String(value)} search value`, () => {
      expect(getSearchValues({ location })).toEqual(
        new Map().set("test", { value: String(value) }),
      );
    });
  });
  arrayValues.forEach(values => {
    const testValues = values.map(value => String(value));
    const location: Location = {
      pathname: "/some/route",
      search: generateValuesSearchQuery("test", testValues),
      hash: "#",
    };
    it(`handles array ${String(values)} search values`, () => {
      expect(getSearchValues({ location })).toEqual(
        new Map().set("test", { values: testValues }),
      );
    });
  });
});

describe("updateSearchUrl", () => {
  const location: Location = {
    pathname: "/some/route",
    search: "",
    hash: "#",
  };
  it("handles no search values", () => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    updateSearchUrl({ location, history, searchOptions: new Map() });
    expect(history.replace).not.toBeCalled();
    expect(history.push).not.toBeCalled();
  });
  singleValues.forEach(value => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    it(`handles ${String(value)} search value`, () => {
      updateSearchUrl({
        location,
        history,
        searchOptions: new Map().set("test", { value, placeholder }),
      });
      expect(history.replace).toBeCalledWith({
        search: generateValueSearchQuery("test", value),
      });
    });
  });
  arrayValues.forEach(values => {
    const history = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    it(`handles array ${String(values)} search values`, () => {
      updateSearchUrl({
        location,
        history,
        searchOptions: new Map().set("test", { values, placeholder }),
      });
      const search = generateValuesSearchQuery("test", values);
      expect(history.replace).toBeCalledWith({ search });
    });
  });
});
