import "../mocks";
import { localStorage } from ".";

beforeEach(() => {
  (global as any).localStorage.clear();
});

const testKey = "foo";
const testValue = "bar";

describe("set", () => {
  it("sets value to key in localStorage", () => {
    const store = {};
    store[testKey] = `"${testValue}"`;
    localStorage.set(testKey, testValue);
    expect((global as any).localStorage.store).toEqual(store);
  });
});

describe("get", () => {
  it("gets value from localStorage", () => {
    localStorage.set(testKey, testValue);
    expect(localStorage.get(testKey)).toEqual(testValue);
  });
});

describe("remove", () => {
  it("removes value from localStorage", () => {
    localStorage.set(testKey, testValue);
    localStorage.remove(testKey);
    expect(localStorage.get(testKey)).toBeUndefined();
  });
});

const testMap = new Map()
  .set(1, "test1")
  .set(2, { test2a: "testing", test2b: 0 })
  .set(3, "test3");
const testJson =
  '[[1,"test1"],[2,{"test2a":"testing","test2b":0}],[3,"test3"]]';

describe("setMap", () => {
  it("sets map properly in localStorage", () => {
    localStorage.setMap(testKey, testMap);
    expect(localStorage.get(testKey)).toEqual(testJson);
  });
  it("errors for invalid maps", () => {
    expect(() => localStorage.setMap(testKey, null)).toThrowError();
  });
});

describe("getMap", () => {
  it("gets map properly in localStorage", () => {
    localStorage.set(testKey, testJson);
    expect(localStorage.getMap(testKey)).toEqual(testMap);
  });
  it("returns empty map if value is not present", () => {
    expect(localStorage.getMap(testKey)).toEqual(new Map());
  });
});

describe("getLocalStorage", () => {
  it("errors if localStorage is not available", () => {
    (global as any)._localStorage = undefined;
    expect(() => localStorage.set(testKey, testValue)).toThrowError();
  });
});
