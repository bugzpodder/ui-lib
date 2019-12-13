export declare const generateFilledArray: (count: number, valueOrGenerator?: any) => any[];
export declare function serializePromises<T, R>(array: Array<T>, mapper: (x0: T, x1?: number) => Promise<R>): Promise<R[]>;
export declare const mapBy: (array: any[], idKey?: string) => Map<string, any>;
export declare const toPairWise: <T>(arr: T[]) => [T, T][];
