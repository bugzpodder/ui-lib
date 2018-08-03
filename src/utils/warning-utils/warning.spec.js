// @flow
import { Warning } from "./warning";

describe("warning", () => {
  it("should be a warning", () => {
    expect(new Warning("warning").isWarning).toEqual(true);
  });
});
