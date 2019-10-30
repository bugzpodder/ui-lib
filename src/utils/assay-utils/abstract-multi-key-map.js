// @flow
/**
 * Abstract class, please implement the abstract methods
 *
 * Note: we use function declarations over arrow functions here as
 * babel translates arrow functions to be instance properties rather
 * than prototype properties, thus disallowing child class from
 * calling functions from parent class via `super`.
 * See https://medium.com/@charpeni/3b3551c440b1 for more details.
 */
export class AbstractMultiKeyMap {
  _map: Map<string, Object>;

  // istanbul ignore next
  constructor(iterables?: Array<[Object, Object]>) {
    if (this.constructor === AbstractMultiKeyMap) {
      throw new TypeError("Cannot instantiate abstract class");
    }
    const tuples = [];
    if (iterables) {
      iterables.forEach(tuple => {
        tuples.push([this.serializeKey(tuple[0]), tuple[1]]);
      });
    }
    this._map = new Map(tuples);

    // Bind all methods
    // $FlowFixMe
    this.get = this.get.bind(this);
    // $FlowFixMe
    this.set = this.set.bind(this);
    // $FlowFixMe
    this.has = this.has.bind(this);
    // $FlowFixMe
    this.delete = this.delete.bind(this);
    // $FlowFixMe
    this.forEach = this.forEach.bind(this);
    // $FlowFixMe
    this.clear = this.clear.bind(this);
    // $FlowFixMe
    this.size = this.size.bind(this);
    // $FlowFixMe
    this.keys = this.keys.bind(this);
    // $FlowFixMe
    this.serializeKey = this.serializeKey.bind(this);
    // $FlowFixMe
    this.deserializeKey = this.deserializeKey.bind(this);
  }

  /* eslint-disable class-methods-use-this */
  // istanbul ignore next abstract
  serializeKey(key: Object) {
    console.debug(`Serializing ${key.toString()}`);
    throw new TypeError("Must implement serializeKey");
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  //  istanbul ignore next abstract
  deserializeKey(key: string) {
    console.debug(`Deserializing ${key}`);
    throw new TypeError("Must implement deserializeKey");
  }
  /* eslint-enable class-methods-use-this */

  set(object: Object, value: any) {
    this._map.set(this.serializeKey(object), value);
    return this;
  }

  get(object: Object) {
    return this._map.get(this.serializeKey(object));
  }

  has(object: Object) {
    return this._map.has(this.serializeKey(object));
  }

  delete(object: Object) {
    this._map.delete(this.serializeKey(object));
    return this;
  }

  forEach(callback: Function, callersThis: any) {
    this._map.forEach((value, key) => {
      callback.apply(callersThis, [value, this.deserializeKey(key)]);
    });
  }

  clear() {
    this._map.clear();
  }

  size() {
    return this._map.size;
  }

  keys(): Array<Object> {
    return [...this._map.keys()].map(key => this.deserializeKey(key));
  }
}
