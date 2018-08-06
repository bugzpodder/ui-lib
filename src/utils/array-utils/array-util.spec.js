// @flow
import { generateFilledArray, mapBy, serializePromises } from "./array-util";

describe("generateFilledArray", () => {
  it("shall generate an empty array", () => {
    expect(generateFilledArray(0)).toEqual([]);
  });
  it("shall generate an array with zeros", () => {
    expect(generateFilledArray(3)).toEqual([0, 0, 0]);
  });
  it("shall generate an array with numbers", () => {
    expect(generateFilledArray(3, -1)).toEqual([-1, -1, -1]);
  });
  it("shall generate an array with empty strings", () => {
    expect(generateFilledArray(4, "")).toEqual(["", "", "", ""]);
  });
  it("shall generate an array with strings", () => {
    expect(generateFilledArray(2, "abc")).toEqual(["abc", "abc"]);
  });
  it("shall generate an array using a generator", () => {
    expect(generateFilledArray(4, (_, index) => index - 1)).toEqual([-1, 0, 1, 2]);
  });
});

describe("generateFilledArray functional", () => {
  it("shall generate a array with numbers", () => {
    let start = -4;
    // eslint-disable-next-line no-plusplus
    const values = generateFilledArray(4, () => start++);
    expect(values).toEqual([-4, -3, -2, -1]);
  });
});

describe("serializePromises", () => {
  it("shall serially call array functions", (done) => {
    const count = 10;
    let start = 0;
    // eslint-disable-next-line no-plusplus
    const values = generateFilledArray(count, () => start++);
    const resolutionValues = new Array(count);
    let resolutionIndex = 0;
    const promise = serializePromises(
      values,
      value => new Promise((resolve) => {
        setTimeout(() => {
          resolutionValues[resolutionIndex] = value;
          resolutionIndex += 1;
          resolve(value);
        }, Math.random() * 10);
      }),
    );
    promise.then((results) => {
      expect(resolutionValues).toEqual(values);
      expect(results).toEqual(values);
      done();
    });
  });
});

describe("mapBy", () => {
  it("shall handle empty array", () => {
    const array = [];
    expect(mapBy(array)).toEqual(new Map());
  });
  it("shall map by idKey", () => {
    const array = [
      {
        someKey: "x",
        value: "a",
      },
      {
        someKey: "c",
        value: "b",
      },
    ];
    expect(mapBy(array, "someKey")).toEqual(new Map().set("x", array[0]).set("c", array[1]));
  });
});
