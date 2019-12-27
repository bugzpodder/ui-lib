/**
 * Abstract class, please implement the abstract methods
 *
 * Note: we use function declarations over arrow functions here as
 * babel translates arrow functions to be instance properties rather
 * than prototype properties, thus disallowing child class from
 * calling functions from parent class via `super`.
 * See https://medium.com/@charpeni/3b3551c440b1 for more details.
 */
export declare class AbstractMultiKeyMap {
    _map: Map<string, Record<string, any>>;
    constructor(iterables?: Array<[Record<string, any>, Record<string, any>]>);
    serializeKey(key: Record<string, any>): string;
    deserializeKey(key: string): any;
    set(object: Record<string, any>, value: any): AbstractMultiKeyMap;
    get(object: Record<string, any>): any;
    has(object: Record<string, any>): boolean;
    delete(object: Record<string, any>): AbstractMultiKeyMap;
    forEach(callback: Function, callersThis?: any): void;
    clear(): void;
    size(): number;
    keys(): Record<string, any>[];
}
