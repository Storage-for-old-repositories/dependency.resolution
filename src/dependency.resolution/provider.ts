type ProviderDependenciesBound = Record<string, Provider>;

type ProviderDependenciesResolution<Dependencies> =
  Dependencies extends ProviderDependenciesBound
    ? {
        [K in keyof Dependencies]: Dependencies[K] extends Provider<infer R>
          ? R
          : never;
      }
    : never;

type ProviderResolver<Dependencies, Provide> = (
  dependencies: Dependencies
) => Provide | Promise<Provide>;

export interface ProviderOptionsFrom {
  /** @default */
  isSingleton: boolean;
}

export interface ProviderOptionsCreate<Dependencies> {
  dependencies: Dependencies;
}

export default class Provider<
  _Provide = any,
  Dependencies = any,
  Resolver = any
> {
  private _isSingleton = true;

  private constructor(
    private readonly _dependencies: Readonly<Dependencies>,
    private readonly _resolver: Resolver
  ) {}

  public static create<Provide, Dependencies extends ProviderDependenciesBound>(
    options: ProviderOptionsCreate<Dependencies> & Partial<ProviderOptionsFrom>,
    resolver: ProviderResolver<
      ProviderDependenciesResolution<Dependencies>,
      Provide
    >
  ) {
    const dependencies = { ...options.dependencies };
    const provider = new Provider<Provide, Dependencies, typeof resolver>(
      dependencies,
      resolver
    );
    provider.applyOptionsFrom(options);
    return provider;
  }

  private applyOptionsFrom(options: Partial<ProviderOptionsFrom>) {
    if (typeof options.isSingleton === "boolean") {
      this._isSingleton = options.isSingleton;
    }
  }

  public from(options: Partial<ProviderOptionsFrom>) {
    const provider = new Provider<_Provide, Dependencies, Resolver>(
      this._dependencies,
      this._resolver
    );
    provider.applyOptionsFrom(options);
    return provider;
  }

  public get dependencies() {
    return { ...this._dependencies };
  }

  public get resolver() {
    return this._resolver;
  }

  public get isSingleton() {
    return this._isSingleton;
  }
}
