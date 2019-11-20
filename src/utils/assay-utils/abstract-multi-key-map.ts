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
  _map: Map<
    string,
    {
      [x: string]: any;
    }
  >;

  // istanbul ignore next
  constructor(
    iterables?: Array<
      [
        {
          [x: string]: any;
        },
        {
          [x: string]: any;
        },
      ]
    >,
  ) {
    if (this.constructor === AbstractMultiKeyMap) {
      throw new TypeError("Cannot instantiate abstract class");
    }
    const tuples: Array<any> = [];
    if (iterables) {
      iterables.forEach(tuple => {
        tuples.push([this.serializeKey(tuple[0]), tuple[1]]);
      });
    }
    this._map = new Map(tuples);

    // Bind all methods
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.has = this.has.bind(this);
    this.delete = this.delete.bind(this);
    this.forEach = this.forEach.bind(this);
    this.clear = this.clear.bind(this);
    this.size = this.size.bind(this);
    this.keys = this.keys.bind(this);
    this.serializeKey = this.serializeKey.bind(this);
    this.deserializeKey = this.deserializeKey.bind(this);
  }

  /* eslint-disable class-methods-use-this */
  // istanbul ignore next abstract
  serializeKey(key: { [x: string]: any }): string {
    console.debug(`Serializing ${key.toString()}`);
    throw new TypeError("Must implement serializeKey");
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  //  istanbul ignore next abstract
  deserializeKey(key: string): any {
    console.debug(`Deserializing ${key}`);
    throw new TypeError("Must implement deserializeKey");
  }
  /* eslint-enable class-methods-use-this */

  set(
    object: {
      [x: string]: any;
    },
    value: any,
  ) {
    this._map.set(this.serializeKey(object), value);
    return this;
  }

  get(object: { [x: string]: any }) {
    return this._map.get(this.serializeKey(object));
  }

  has(object: { [x: string]: any }) {
    return this._map.has(this.serializeKey(object));
  }

  delete(object: { [x: string]: any }) {
    this._map.delete(this.serializeKey(object));
    return this;
  }

  forEach(callback: Function, callersThis?: any) {
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

  keys(): Array<{
    [x: string]: any;
  }> {
    return Array.from(this._map.keys()).map(key => this.deserializeKey(key));
  }
}
