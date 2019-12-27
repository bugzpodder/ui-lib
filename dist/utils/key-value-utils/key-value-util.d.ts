import { KeyValue } from "../../types/common";
export declare const setKeyValue: (keyValues: Record<string, any>[], item: Record<string, any>) => void;
export declare const hasKeyValue: (keyValues: KeyValue[], k: string, v: string) => boolean;
export declare const hasKey: (keyValues: KeyValue[], k: string) => boolean;
