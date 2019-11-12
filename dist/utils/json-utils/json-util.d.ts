export declare const convertObjectKeys: (keyMutator: Function, ignoredKeys: string[] | undefined, object: any) => any;
export declare const titleizeObjectKeys: (object: any, ignoredKeys?: string[] | undefined) => any;
export declare const camelizeObjectKeys: (object: any, ignoredKeys?: string[] | undefined) => any;
export declare const mapToJson: Function;
export declare const jsonToMap: Function;
export declare const trimObjectValues: (object: {
    [x: string]: any;
}) => object;
export declare const flattenObject: (originalObject: {
    [x: string]: any;
}) => any;
