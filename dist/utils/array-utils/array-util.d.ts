export declare const generateFilledArray: (count: number, valueOrGenerator?: any) => any[];
export declare const serializePromises: (array: any[], mapper: (x0: any) => Promise<any>) => Promise<Promise<any>[]>;
export declare const mapBy: (array: any[], idKey?: string) => Map<string, any>;
export declare const toPairWise: <T>(arr: T[]) => [T, T][];
