declare class LocalStorageMock {
    store: {
        [x: string]: any;
    };
    clear(): void;
    getItem(key: any): any;
    setItem(key: any, value: any): void;
    removeItem(key: any): void;
}
