import { DependencyRuntime } from "./dependency.runtime";

export interface Configurate {
  timeout?: number;
}

type TemporaryRef<T> = null | T;
type PromisifyProxyContainerValue<T> = T extends (
  ...args: infer Args
) => infer F
  ? (...args: Args) => Promise<Awaited<F>>
  : () => Promise<Awaited<T>>;

type TFGetProxyContainerType<T> = T extends (...args: any[]) => infer R
  ? Awaited<R>
  : never;

export class ProxyDependencyRuntime<
  C extends (dependencies: D) => any,
  D extends Record<string, any>
> {
  private _proxyContainer: null | { container: TFGetProxyContainerType<C> } =
    null;
  private _constructor: TemporaryRef<C>;
  private _dependenciesContainer: TemporaryRef<DependencyRuntime<D>>;
  private _configurate: TemporaryRef<Configurate>;

  constructor({
    constructor,
    container,
    configurate,
  }: {
    constructor: C;
    container: DependencyRuntime<D>;
    configurate: Configurate;
  }) {
    this._constructor = constructor;
    this._dependenciesContainer = container;
    this._configurate = configurate;
  }

  static dependenciesProxy<D extends Record<string, any>>(
    dependencies: DependencyRuntime<D>,
    configurate: Configurate = {}
  ) {
    return new ProxyDependencyRuntime({
      constructor: (identity) => identity,
      configurate,
      container: dependencies,
    });
  }

  public async get<K extends keyof TFGetProxyContainerType<C>>(
    key: K,
    ...args: Parameters<
      PromisifyProxyContainerValue<TFGetProxyContainerType<C>[K]>
    >
  ) {
    const getter = this.getter<K>(key);
    const value = await getter(...args);
    return value as ReturnType<
      PromisifyProxyContainerValue<TFGetProxyContainerType<C>[K]>
    >;
  }

  public getter<K extends keyof TFGetProxyContainerType<C>>(key: K) {
    const proxyMethod = async (...args: any[]) => {
      const container = await this.buildProxyContainer();
      const value = container[key];

      if (typeof value === "function") {
        return await value(...args);
      }
      return value;
    };
    type ProxyMethodToValue = PromisifyProxyContainerValue<
      TFGetProxyContainerType<C>[K]
    >;
    return proxyMethod as ProxyMethodToValue;
  }

  private async buildProxyContainer() {
    if (this._proxyContainer !== null) {
      return this._proxyContainer.container;
    }
    const dependenciesContainer: D = await this.buildContainerDependencies();
    const container = await this._constructor!(dependenciesContainer);

    this._proxyContainer = { container };
    this._constructor = null;
    this._dependenciesContainer = null;
    this._configurate = null;
    return container;
  }

  private async buildContainerDependencies() {
    if (typeof this._configurate!.timeout === "number") {
      return this._dependenciesContainer!.toPromiseTimeout(
        this._configurate!.timeout
      );
    }
    return this._dependenciesContainer!.toPromise();
  }
}
