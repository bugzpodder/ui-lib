import { KeyValue } from "../../types/common";

export const setKeyValue = (
  keyValues: Array<Record<string, any>>,
  item: Record<string, any>,
): void => {
  for (let i = 0; i < keyValues.length; i++) {
    if (keyValues[i].key === item.key) {
      keyValues[i] = item;
      return;
    }
  }
  keyValues.push(item);
};

export const hasKeyValue = (
  keyValues: KeyValue[],
  k: string,
  v: string,
): boolean => keyValues.some(({ key, value }) => key === k && value === v);

export const hasKey = (keyValues: KeyValue[], k: string): boolean =>
  keyValues.some(({ key }) => key === k);
