class LocalStorageMock {
  store: {
    [x: string]: any;
  } = {};

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key];
  }

  setItem(key, value) {
    if (value) {
      this.store[key] = value.toString();
    }
  }

  removeItem(key) {
    delete this.store[key];
  }
}

(global as any)._localStorage = new LocalStorageMock();
