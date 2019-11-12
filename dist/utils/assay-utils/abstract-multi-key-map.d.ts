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
    _map: Map<string, {
        [x: string]: any;
    }>;
    constructor(iterables?: Array<[{
        [x: string]: any;
    }, {
        [x: string]: any;
    }]>);
    serializeKey(key: {
        [x: string]: any;
    }): string;
    deserializeKey(key: string): any;
    set(object: {
        [x: string]: any;
    }, value: any): this;
    get(object: {
        [x: string]: any;
    }): {
        [x: string]: any;
    } | undefined;
    has(object: {
        [x: string]: any;
    }): boolean;
    delete(object: {
        [x: string]: any;
    }): this;
    forEach(callback: Function, callersThis?: any): void;
    clear(): void;
    size(): number;
    keys(): Array<{
        [x: string]: any;
    }>;
}
