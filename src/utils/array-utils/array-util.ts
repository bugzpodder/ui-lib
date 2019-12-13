import isArray from "lodash/isArray";

export const generateFilledArray = (
  count: number,
  valueOrGenerator: any = 0,
): Array<any> => {
  if (typeof valueOrGenerator === "function") {
    return Array(count)
      .fill(null)
      .map(valueOrGenerator);
  }
  return Array(count).fill(valueOrGenerator);
};

// This sequentially executes promises after each prior promise resolves.
export async function serializePromises<T, R>(
  array: Array<T>,
  mapper: (x0: T, x1?: number) => Promise<R>,
) {
  const results: R[] = [];
  let ind = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await mapper(item, ind));
    ind += 1;
  }
  return results;
}

// Similar to lodash keyBy. Returns a `new Map` with each `idKey` in the
// array items as the Map's key.
export const mapBy = (array: Array<any>, idKey = "id"): Map<string, any> =>
  array.reduce((result, item) => {
    result.set(item[idKey], item);
    return result;
  }, new Map());

// toPairWise takes an array of size n and returns an array of size n - 1, where
// each item is a two-element array holding two consecutive elements in the
// original array, in the order in which they appeared.
// Examples:
// Given [], returns [].
// Given [1], returns [].
// Given [1, 2], returns [[1, 2]].
// Given [1, 2, 3], returns [[1, 2], [2, 3]].
// Given [1, 2, 3, 4], returns [[1, 2], [2, 3], [3, 4]].
export const toPairWise = <T>(arr: Array<T>): Array<[T, T]> => {
  const pairsArr: Array<[T, T]> = [];
  if (!isArray(arr)) {
    throw new Error("Only arrays can be passed into toPairWise.");
  }
  arr.forEach((element: T, index) => {
    if (index + 1 < arr.length) {
      pairsArr.push([element, arr[index + 1]]);
    }
  });
  return pairsArr;
};
