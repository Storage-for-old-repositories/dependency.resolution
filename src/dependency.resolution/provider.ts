import { IProvider } from "./interfaces/index";

/// TODO: Подумать действительно ли нужен флаг `isSingleton`

type ProviderDependenciesBound = Record<string, IProvider>;

type ProviderDependenciesResolution<Dependencies> =
  Dependencies extends ProviderDependenciesBound
    ? {
        [K in keyof Dependencies]: Dependencies[K] extends IProvider<infer R>
          ? R
          : never;
      }
    : never;

type ProviderResolver<Provide, Dependencies, Config> = (
  dependencies: ProviderDependenciesResolution<Dependencies>,
  config: Config
) => Provide | Promise<Provide>;

export interface ProviderOptions<Config> {
  /** @default true */
  isSingleton: boolean;
  config: Config;
}

export interface ProviderSharedOptions<Dependencies> {
  dependencies: Dependencies;
}

export default class Provider<
  Provide = unknown,
  Dependencies = ProviderDependenciesBound,
  Config = void
> extends IProvider<Provide> {
  private _isSingleton = true;
  private _config: Readonly<Config> = undefined!;

  private constructor(
    private readonly _dependencies: Readonly<Dependencies>,
    private readonly _resolver: ProviderResolver<Provide, Dependencies, Config>
  ) {
    super();
  }

  public static create<
    Provide,
    Dependencies extends ProviderDependenciesBound,
    Config = void
  >(
    options: ProviderSharedOptions<Dependencies> &
      Partial<ProviderOptions<Config>>,
    resolver: ProviderResolver<Provide, Dependencies, Config>
  ) {
    const dependencies = { ...options.dependencies };
    const provider = new Provider(dependencies, resolver);
    return provider.applyOptions(options);
  }

  private applyOptions(options: Partial<ProviderOptions<Config>>): this {
    this._config = options.config!;
    if (typeof options.isSingleton === "boolean") {
      this._isSingleton = options.isSingleton;
    }
    return this;
  }

  public create(options?: Partial<ProviderOptions<Config>>) {
    const provider = new Provider(this._dependencies, this._resolver);
    if (options) {
      return provider.applyOptions(options);
    }
    return provider;
  }

  public get dependencies() {
    return this._dependencies;
  }

  public get resolver() {
    return this._resolver;
  }

  public get isSingleton() {
    return this._isSingleton;
  }

  public get config() {
    return this._config;
  }
}
