export default class Chain<K, V> {
  private readonly _valuesSubscribers = new Map<K, V>();
  private readonly _children: Chain<K, V>[] = [];
  private constructor() {}

  public static create<K, V>() {
    return new Chain<K, V>();
  }

  public has(key: K) {
    return this._valuesSubscribers.has(key);
  }

  public get(key: K) {
    return this._valuesSubscribers.get(key);
  }

  public add(key: K, value: V) {
    const chains: Chain<K, V>[] = [this];
    while (chains.length > 0) {
      const chain = chains.pop()!;
      chain._valuesSubscribers.set(key, value);
      chains.push(...chain._children);
    }
  }

  public forkChain() {
    const chain = new Chain<K, V>();
    this._children.push(chain);
    return chain;
  }
}
