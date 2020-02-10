import { camelCase, forEach, isEmpty, isObject, upperFirst } from "lodash";

export const convertObjectKeys = (
  keyMutator: Function,
  ignoredKeys: string[] | undefined,
  object: any,
): any => {
  let convertedObject;
  if (Array.isArray(object)) {
    convertedObject = [];
    forEach(object, value => {
      if (typeof value === "object") {
        value = convertObjectKeys(keyMutator, ignoredKeys, value);
      }
      convertedObject.push(value);
    });
  } else if (isObject(object)) {
    convertedObject = {};
    forEach(object, (value: any, key) => {
      if (
        typeof value === "object" &&
        (!ignoredKeys || !ignoredKeys.includes(key))
      ) {
        value = convertObjectKeys(keyMutator, ignoredKeys, value);
      }
      if (
        /^[A-Z0-9_]*$/.test(key) ||
        (/^[a-z0-9_]*$/.test(key) && key.includes("_"))
      ) {
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

const titleize = (key: string): string => upperFirst(camelCase(key));
export const titleizeObjectKeys = (object: any, ignoredKeys?: string[]): any =>
  convertObjectKeys(titleize, ignoredKeys, object);
export const camelizeObjectKeys = (object: any, ignoredKeys?: string[]): any =>
  convertObjectKeys(camelCase, ignoredKeys, object);

// warning: does not work if the map's key or value is another map object.
export const mapToJson: Function = (map: Map<any, any>) => {
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

export const trimObjectValues = (object: any): any => {
  if (!isObject(object) || object.constructor !== Object) {
    return object;
  }
  const formattedObject = { ...object };
  Object.entries(formattedObject).forEach(entry => {
    if (typeof entry[1] === "string") {
      formattedObject[entry[0]] = entry[1].trim();
    }
  });
  return formattedObject;
};

// TODO(nsawas): Get this to handle duplicate keys (nested objects with keys identical to parent(s)).
export const flattenObject = (
  originalObject: Record<string, any>,
): Record<string, any> => {
  if (!isObject(originalObject) || originalObject.constructor !== Object) {
    return originalObject;
  }
  if (isEmpty(originalObject)) {
    return {};
  }
  const flatten = (object): any =>
    [].concat(
      ...Object.keys(object).map(key => {
        if (
          object[key] &&
          typeof object[key] === "object" &&
          object[key].constructor === Object
        ) {
          return flatten(object[key]);
        }
        return { [key]: object[key] };
      }),
    );
  return Object.assign({}, ...flatten(originalObject));
};
