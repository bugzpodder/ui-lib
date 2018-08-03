// @flow
import { getQuery } from "./url-util";

describe("getQuery", () => {
  it("handles no search query", () => {
    expect(getQuery()).toEqual({});
  });
  it("handles props with no location", () => {
    expect(getQuery({})).toEqual({});
  });
  it("handles props with location but no location", () => {
    const props = {
      location: {},
    };
    expect(getQuery(props)).toEqual({});
  });
  it("handles props with location with pathname, but no search", () => {
    const props = {
      location: {
        pathname: "/some/route",
      },
    };
    expect(getQuery(props)).toEqual({});
  });
  it("handles props with location with pathname, and empty search", () => {
    const props = {
      location: {
        pathname: "/some/route",
        search: "",
      },
    };
    expect(getQuery(props)).toEqual({});
  });
  it("handles search query", () => {
    const props = {
      location: {
        pathname: "/some/route",
        search: "?someQuery=5&anotherQuery=abc",
      },
    };
    expect(getQuery(props)).toEqual({ someQuery: "5", anotherQuery: "abc" });
  });
});
