// @flow
import camelCase from "lodash/camelCase";
import forEach from "lodash/forEach";
import isObject from "lodash/isObject";
import upperFirst from "lodash/upperFirst";

export const convertObjectKeys = (keyMutator: Function, ignoredKeys?: Array<string>, object: any): any => {
  let convertedObject;
  if (Array.isArray(object)) {
    convertedObject = [];
    forEach(object, (value) => {
      if (typeof value === "object") {
        value = convertObjectKeys(keyMutator, ignoredKeys, value);
      }
      convertedObject.push(value);
    });
  } else if (isObject(object)) {
    convertedObject = {};
    forEach(object, (value, key) => {
      if (typeof value === "object" && (!ignoredKeys || !ignoredKeys.includes(key))) {
        value = convertObjectKeys(keyMutator, ignoredKeys, value);
      }
      if (/^[A-Z0-9_]*$/.test(key) || (/^[a-z0-9_]*$/.test(key) && key.includes("_"))) {
        // When parsing JSON, don't mutate uppercase keys to lowercase.
        // This is frequently a problem for maps where the key is an `UPPER` cased enum.
        convertedObject[key] = value;
      } else {
        convertedObject[keyMutator(key)] = value;
      }
    });
  } else {
    convertedObject = object;
  }
  return convertedObject;
};

const titleize = key => upperFirst(camelCase(key));
// eslint-disable-next-line max-len
export const titleizeObjectKeys = (object: any, ignoredKeys?: Array<string>) => convertObjectKeys(titleize, ignoredKeys, object);
// eslint-disable-next-line max-len
export const camelizeObjectKeys = (object: any, ignoredKeys?: Array<string>) => convertObjectKeys(camelCase, ignoredKeys, object);

// warning: does not work if the map's key or value is another map object.
export const mapToJson: Function = (map: Map<*, *>) => {
  if (!map) {
    return "";
  }
  return JSON.stringify([...map]);
};

export const jsonToMap: Function = (jsonStr: string) => {
  if (!jsonStr) {
    return new Map();
  }
  return new Map(JSON.parse(jsonStr));
};

export const trimObjectValues = (object: Object) => {
  if (!isObject(object) || object.constructor !== Object) {
    return object;
  }
  const formattedObject = { ...object };
  Object.entries(formattedObject).forEach((entry) => {
    // $FlowFixMe: property trim is missing in "mixed";
    if (typeof entry[1] === "string") {
      formattedObject[entry[0]] = entry[1].trim();
    }
  });
  return formattedObject;
};
