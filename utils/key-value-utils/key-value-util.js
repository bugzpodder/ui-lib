// @flow
export const setKeyValue = (keyValues: Array<Object>, item: Object) => {
	for (let i = 0; i < keyValues.length; i++) {
		if (keyValues[i].key === item.key) {
			keyValues[i] = item;
			return;
		}
	}
	keyValues.push(item);
};

export const hasKeyValue = (keyValues: Array<KeyValue>, k: string, v: string) => {
	return keyValues.some(({ key, value }) => key === k && value === v);
};

export const hasKey = (keyValues: Array<KeyValue>, k: string) => {
	return keyValues.some(({ key }) => key === k);
};
