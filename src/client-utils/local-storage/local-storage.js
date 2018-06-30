// @flow
import * as jsonUtil from "@grail/lib/src/utils/json-utils";

const getLocalStorage = () => {
	const { localStorage } = global;
	if (!localStorage) {
		throw new Error("`global.localStorage` is not defined.");
	}
	return localStorage;
};

export const set = (key: string, object: any) => {
	getLocalStorage().setItem(key, JSON.stringify(object));
};

export const get = (key: string, defaultValue: any = undefined) => {
	const object = getLocalStorage().getItem(key);
	if (object !== undefined && object !== null && object !== "undefined") {
		return JSON.parse(object);
	}
	set(key, defaultValue);
	return defaultValue;
};

export const remove = (key: string) => {
	getLocalStorage().removeItem(key);
};

export const setMap: Function = (key: string, map: Map<*, *>) => {
	if (map instanceof Map) {
		const mapJson = jsonUtil.mapToJson(map);
		set(key, mapJson);
	} else {
		throw new Error("Value is not a Map object");
	}
};

export const getMap: Function = (key: string) => {
	const mapJson = get(key);
	return mapJson ? jsonUtil.jsonToMap(mapJson) : new Map();
};
