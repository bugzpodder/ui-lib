// @flow
class LocalStorageMock {
	store: Object = {};

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
}

global.localStorage = new LocalStorageMock();
