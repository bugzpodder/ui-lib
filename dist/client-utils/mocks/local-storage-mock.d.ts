declare class LocalStorageMock {
    store: Record<string, any>;
    clear(): void;
    getItem(key: any): string;
    setItem(key: any, value: any): void;
    removeItem(key: any): void;
}
