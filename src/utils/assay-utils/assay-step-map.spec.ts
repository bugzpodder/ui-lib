import { AssayStepMap } from "./assay-step-map";
import { isEqual } from "lodash";

describe("AssayStepMap", () => {
  it("can be instantiated", () => {
    expect(new AssayStepMap()).toBeDefined();
  });
  it("can clear", () => {
    const map = new AssayStepMap([{ assay: "a", step: "b", value: 1 }]);
    expect(map.get({ assay: "a", step: "b" })).toBe(1);
    map.clear();
    expect(map.get({ assay: "a", step: "b" })).toBe(undefined);
  });
  it("can add values", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1);
    expect(map.get({ assay: "a", step: "b" })).toBe(1);
    expect(map.get({ assay: "a", step: "c" })).toBe(undefined);
  });
  it("can add values by calling set multiple times", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1).set({ assay: "b", step: "c" }, 2);
    expect(map.get({ assay: "a", step: "b" })).toBe(1);
    expect(map.get({ assay: "b", step: "c" })).toBe(2);
    expect(map.get({ assay: "a", step: "c" })).toBe(undefined);
  });
  it("can replace values", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1);
    map.set({ assay: "a", step: "c" }, 5);
    map.set({ assay: "a", step: "b" }, 2);
    expect(map.get({ assay: "a", step: "b" })).toBe(2);
    expect(map.get({ assay: "a", step: "c" })).toBe(5);
  });
  it("implements has()", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1);
    map.set({ assay: "a", step: "c" }, 5);
    map.set({ assay: "a", step: "b" }, 2);
    expect(map.has({ assay: "a", step: "b" })).toBe(true);
    expect(map.has({ assay: "a", step: "c" })).toBe(true);
    expect(map.has({ assay: "a", step: "xyz" })).toBe(false);
  });
  it("implements delete()", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1);
    map.set({ assay: "a", step: "c" }, 5);
    map.set({ assay: "a", step: "b" }, 2);
    map.delete({ assay: "a", step: "c" });
    map.delete({ assay: "a", step: "xyz" });
    expect(map.has({ assay: "a", step: "b" })).toBe(true);
    expect(map.has({ assay: "a", step: "c" })).toBe(false);
  });
  const assayStepValues = [
    { assay: "a", step: "b", value: 1 },
    { assay: "a", step: "c", value: 5 },
    { assay: "d", step: "e", value: 42 },
    { assay: "Some Assay", step: "SOME Step", value: { a: 1, b: "abc" } },
  ];
  const map = new AssayStepMap(assayStepValues);
  it("implements forEach()", () => {
    map.forEach((value, { assay, step }) => {
      const match = assayStepValues.find(assayStepValue =>
        isEqual(assayStepValue, { assay, step, value }),
      );
      expect(match).toBeDefined();
      if (match) {
        expect(assay).toBe(match.assay);
        expect(step).toBe(match.step);
        expect(value).toBe(match.value);
      }
    });
  });
  it("implements keys()", () => {
    const keys = map.keys();
    const expectedKeys = assayStepValues.map(({ assay, step }) => ({
      assay,
      step,
    }));
    expect(keys).toEqual(expectedKeys);
  });
  it("implements size()", () => {
    const map = new AssayStepMap();
    map.set({ assay: "a", step: "b" }, 1);
    map.set({ assay: "b", step: "b" }, 1);
    const size = map.size();
    expect(size).toEqual(2);
  });
  it("throws on invalid valid", () => {
    const map = new AssayStepMap();
    expect(() => {
      map.set({}, 1);
    }).toThrow();
  });
});
