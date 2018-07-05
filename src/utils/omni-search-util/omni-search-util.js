// @flow
import { isValueValid } from "@grail/lib";

export const OMNI_KEY = "omni";
export const OMNI_ERROR = "OmniError";

// FIXME(jrosenfield): add documentation for regexes
const validOmniText = /^(([^:]*\s+)?[\w-.]+:)*[^:]*$/;
const searchKey = /(([^:]*\s*)\s)?([\w-.]+):/gm;

const items = /("([^"]*)"?|([^",][^,]+)*),?/gm;

const addItemToArrayMap = (key: string, value: string, arrayMap: Map<string, Array<string>>) => {
	if (isValueValid(value)) {
		const previousValues = arrayMap.get(key);
		if (previousValues === undefined) {
			arrayMap.set(key, [value]);
		} else {
			arrayMap.set(key, [...previousValues, value]);
		}
	}
};

/** Parse a map of field label to field value, using OMNI_KEY if no label is present. */
const parseValuesFromOmniText = (omniText: string): Map<string, Array<string>> => {
	const parsed: Map<string, Array<string>> = new Map();
	if (!validOmniText.test(omniText)) {
		const error = new Error("Invalid search text.");
		error.name = OMNI_ERROR;
		throw error;
	}
	let key = OMNI_KEY;
	let lastIndex = 0;
	let result = searchKey.exec(omniText);
	while (result !== null) {
		addItemToArrayMap(key, result[2], parsed);
		key = result[3];
		lastIndex = searchKey.lastIndex;
		result = searchKey.exec(omniText);
	}
	addItemToArrayMap(key, omniText.slice(lastIndex), parsed);
	return parsed;
};

const getKeysForSearchDef = (searchDef: SearchDef): Array<string> => {
	const aliases = searchDef.aliases;
	if (aliases !== undefined && aliases.length) {
		return [...aliases, ...searchDef.searchFields];
	}
	return [...searchDef.searchFields];
};

/** Go through searchDefs extract values from omniText */
export const getSearchValuesFromOmniText = (searchDefs: SearchDefs, omniText: string): SearchValues => {
	if (!isValueValid(omniText) || !searchDefs || searchDefs.length === 0) {
		return new Map();
	}
	const searchValues: Map<number, string> = new Map();
	const parsedValues = parseValuesFromOmniText(omniText);

	searchDefs.forEach((searchDef, index) => {
		const keys = getKeysForSearchDef(searchDef);
		if (index === 0) {
			keys.unshift(OMNI_KEY);
		}
		let values: Array<string> = [];
		keys.forEach(key => {
			const parsedValueArray = parsedValues.get(key);
			if (parsedValueArray !== undefined) {
				parsedValues.delete(key);
				values = values.concat(parsedValueArray);
			}
		});
		if (values.length) {
			// TODO: consider including a space (", ") when joining.
			searchValues.set(index, values.join(","));
		}
	});

	// If there are field labels that could not be mapped to a searchDef, the omniText is invalid.
	const invalidKey = [...parsedValues.keys()].find(key => !!key);
	if (invalidKey) {
		const error = new Error(`${invalidKey} is not a valid search tag.`);
		error.name = OMNI_ERROR;
		throw error;
	}
	return searchValues;
};

export const getOmniTextFromSearchValues = (searchDefs: SearchDefs, searchValues: SearchValues): string => {
	const omniValues = [];
	searchDefs.forEach((searchDef, index) => {
		const searchValue = searchValues.get(index);
		if (isValueValid(searchValue)) {
			let omniValue = searchValue;
			if (index !== 0) {
				const key = getKeysForSearchDef(searchDef)[0];
				// $FlowFixMe: isValueValid call means omniValue is defined
				omniValue = `${key}:${omniValue}`;
			}
			omniValues.push(omniValue);
		}
	});
	return omniValues.join(" ");
};

export const getOmniTextFromKeyValues = (keyValues: Array<KeyValue>) => {
	return keyValues
		.map(({ key, value }) => {
			return `${key}:${value}`;
		})
		.join(" ");
};

export const getSearchOptions = (searchDefs: SearchDefs, searchValues: SearchValues): SearchOptionsV2 => {
	const searchOptions: Array<string> = [];
	searchDefs.forEach((searchDef, index) => {
		const searchValue = searchValues.get(index);
		if (isValueValid(searchValue)) {
			// $FlowFixMe: isValueValid call means searchValue is defined
			searchOptions.push({ ...searchDef, value: searchValue });
		}
	});
	// $FlowFixMe: cannot return because it thinks it could be object type
	return searchOptions;
};

export const getItemsFromOmniValue = (omniValue: string = ""): Array<string> => {
	const parsedItems: Array<string> = [];
	let lastIndex = 0;
	items.lastIndex = lastIndex;
	let result = items.exec(omniValue);
	while (result !== null && lastIndex !== omniValue.length) {
		lastIndex = items.lastIndex;
		const item = result[3] || result[2] || result[1];
		parsedItems.push(item.trim());
		result = items.exec(omniValue);
	}
	return parsedItems;
};
