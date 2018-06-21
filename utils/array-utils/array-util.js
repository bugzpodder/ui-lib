// @flow
export const generateFilledArray = (count: number, valueOrGenerator: any = 0): Array<any> => {
	if (typeof valueOrGenerator === "function") {
		return Array(count)
			.fill()
			.map(valueOrGenerator);
	}
	return Array(count).fill(valueOrGenerator);
};

export const generateArrayWithIncreasingNumbers = (count: number, start: number = 0) => {
	return generateFilledArray(count, () => start++);
};

// This sequentially executes promises after each prior promise resolves.
export const serializePromises = async (array: Array<any>, mapper: Function) => {
	const promises = [];
	for (const item of array) {
		promises.push(await mapper(item));
	}
	return promises;
};

// Similar to lodash keyBy. Returns a `new Map` with each `idKey` in the
// array items as the Map's key.
export const mapBy = (array: Array<any>, idKey: string = "id"): Map<string, any> => {
	return array.reduce((result, item) => {
		result.set(item[idKey], item);
		return result;
	}, new Map());
};
