import { getPathname } from "./url-util";

describe("getPathname", () => {
  it("handles no props", () => {
    expect(getPathname()).toEqual("");
  });
  it("handles props with no location", () => {
    expect(getPathname({})).toEqual("");
  });
  it("handles props with location, but no pathname", () => {
    const props = {
      location: {},
    };
    expect(getPathname(props)).toEqual("");
  });
  it("handles props with location with pathname", () => {
    const props = {
      location: {
        pathname: "/some/route",
      },
    };
    expect(getPathname(props)).toEqual("/some/route");
  });
  it("handles props with location with pathname and search", () => {
    const props = {
      location: {
        pathname: "/some/route",
        search: "?someQuery=5&anotherQuery=abc",
      },
    };
    expect(getPathname(props)).toEqual("/some/route");
  });
});
