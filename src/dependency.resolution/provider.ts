import IProvider from "./provider.interface";

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
  dependencies: Dependencies,
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
  Provide = any,
  Dependencies = any,
  Resolver = any,
  Config = void
> implements IProvider<Provide>
{
  private _isSingleton = true;
  private _config: Readonly<Config> = undefined!;

  private constructor(
    private readonly _dependencies: Readonly<Dependencies>,
    private readonly _resolver: Resolver
  ) {}

  public static create<
    Provide,
    Dependencies extends ProviderDependenciesBound,
    Config = void
  >(
    options: ProviderSharedOptions<Dependencies> &
      Partial<ProviderOptions<Config>>,
    resolver: ProviderResolver<
      Provide,
      ProviderDependenciesResolution<Dependencies>,
      Config
    >
  ) {
    const dependencies = { ...options.dependencies };
    const provider = new Provider<
      Provide,
      Dependencies,
      typeof resolver,
      Config
    >(dependencies, resolver);
    provider.applyOptionsFrom(options);
    return provider as IProvider<Provide>;
  }

  private applyOptionsFrom(options: Partial<ProviderOptions<Config>>) {
    this._config = options.config!;
    if (typeof options.isSingleton === "boolean") {
      this._isSingleton = options.isSingleton;
    }
  }

  public create(options?: Partial<ProviderOptions<Config>>) {
    const provider = new Provider<Provide, Dependencies, Resolver, Config>(
      this._dependencies,
      this._resolver
    );
    if (options) {
      provider.applyOptionsFrom(options);
    }
    return provider as IProvider<Provide>;
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

// const provide = Provider.create(
//   {
//     dependencies: {
//       file: Provider.create(
//         {
//           dependencies: {},
//         },
//         async () => "hello"
//       ),
//       auto: Provider.create(
//         {
//           dependencies: {},
//         },
//         async () => [["hello"]]
//       ),
//       urb: {} as IProvider<1 | 2>,
//     },
//     config: {
//       work: "sdf",
//     },
//   },
//   async (d, c) => {}
// );
