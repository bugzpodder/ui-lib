class LocalStorageMock {
  store: Record<string, any> = {};

  clear(): void {
    this.store = {};
  }

  getItem(key): string {
    return this.store[key];
  }

  setItem(key, value): void {
    if (value) {
      this.store[key] = value.toString();
    }
  }

  removeItem(key): void {
    delete this.store[key];
  }
}

(global as any)._localStorage = new LocalStorageMock();
