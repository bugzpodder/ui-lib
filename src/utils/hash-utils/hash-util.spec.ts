import { fnv1 } from "./hash-util";

describe("hash", () => {
  it("should compute", () => {
    expect(fnv1("foo")).toEqual(1083137555);
  });
});
