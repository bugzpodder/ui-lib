// @flow
import { isValueValid } from "@grail/lib";

export const OMNI_KEY = "omni";
export const OMNI_ERROR = "OmniError";

/** OMNI SEARCH PATTERN designed to capture field and values from omni search
 * `description: "lims test"`
 * group 1: optional, the label repended to the search values in (eg: `description: `)
 * -	group 2: label text that is part of group 1 (eg: `description`)
 * group 3: the value text, designed to capture a single term without whitespace
 * 					or multiple words enclosed by quotes (eg: `"lims test"`)
 * - group 4: the value enclosed by quotes (eg: `lims test`)
 * - group 5: list of values enclosed by brackets
 * const pattern = /(([^,:("\s]+):\s*)?([^",\s]+|"([^"]*)"?)/gm;
 */
const pattern = /(([^,:("\s]+):\s*)?([^"[,\s]+|"([^"]*)"?|\[([^\]]*)\]?)/gm;

/** Parse a map of field label to field value, using OMNI_KEY if no label is present. */
const parseValuesFromOmniText = (omniText: string): Map<string, Array<string>> => {
	const parsed: Map<string, Array<string>> = new Map();
	let result = pattern.exec(omniText);
	while (result !== null) {
		let key = OMNI_KEY;
		const value = (result[5] && result[5].split(",").map(string => string.trim())) || [result[4] || result[3]];
		if (result[2] !== undefined) {
			key = result[2];
		}
		const previousValue = parsed.get(key);
		if (previousValue === undefined) {
			parsed.set(key, value);
		} else {
			parsed.set(key, previousValue.concat(value));
		}
		result = pattern.exec(omniText);
	}
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
	const searchValues: SearchValues = new Map();
	if (!isValueValid(omniText) || !searchDefs || searchDefs.length === 0) {
		return searchValues;
	}
	const parsedValues = parseValuesFromOmniText(omniText);

	searchDefs.forEach((searchDef, index) => {
		const keys = getKeysForSearchDef(searchDef);
		if (index === 0) {
			keys.unshift(OMNI_KEY);
		}
		const searchValue: Array<string> = [];
		keys.forEach(key => {
			const parsedValueArray = parsedValues.get(key);
			if (parsedValueArray !== undefined) {
				parsedValues.delete(key);
				parsedValueArray.forEach(parsedValue => {
					searchValue.push(isValueValid(parsedValue) ? parsedValue : "");
				});
			}
		});
		if (searchValue.length) {
			searchValues.set(index, searchValue.length > 1 ? searchValue : searchValue[0]);
		}
	});

	// If there are field labels that could not be mapped to a searchDef, the omniText is invalid.
	const invalidKey = [...parsedValues.keys()].find(key => !!key);
	if (invalidKey) {
		const err = new Error(`${invalidKey} is not a valid search tag.`);
		err.name = OMNI_ERROR;
		throw err;
	}
	return searchValues;
};

const getOmniTextForValues = (searchDef: SearchDef, searchValues: SearchValue): ?string => {
	let value: string = "";
	if (!Array.isArray(searchValues)) {
		searchValues = [searchValues];
	}
	if (searchValues.length === 1) {
		value = searchValues[0];
		value = /\w\s+\w/.test(value) ? `"${value}"` : value;
	} else {
		value = `[${searchValues.map(item => (isValueValid(item) ? item : "")).join(", ")}]`;
	}
	const key = getKeysForSearchDef(searchDef)[0];
	return `${key}:${value}`;
};

export const getOmniTextFromSearchValues = (searchDefs: SearchDefs, searchValues: SearchValues): string => {
	const omniValues = [];
	searchDefs.forEach((searchDef, index) => {
		const searchValue = searchValues.get(index);
		if (isValueValid(searchValue)) {
			if (index !== 0) {
				// $FlowFixMe: isValueValid call ensures searchValue is not undefined.
				const omniValue = getOmniTextForValues(searchDef, searchValue);
				if (isValueValid(omniValue)) {
					omniValues.push(omniValue);
				}
			} else {
				omniValues.push(searchValue);
			}
		}
	});
	return omniValues.join(" ");
};

export const getSearchOptions = (searchDefs: SearchDefs, searchValues: SearchValues): SearchOptionsV2 => {
	const searchOptions = [];
	searchDefs.forEach((searchDef, index) => {
		const searchValue = searchValues.get(index);
		if (isValueValid(searchValue)) {
			searchOptions.push({ ...searchDef, value: searchValue });
		}
	});
	return searchOptions;
};
