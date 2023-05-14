declare module "dependency.resolution/provider" {
    type ProviderDependenciesBound = Record<string, Provider>;
    type ProviderDependenciesResolution<Dependencies> = Dependencies extends ProviderDependenciesBound ? {
        [K in keyof Dependencies]: Dependencies[K] extends Provider<infer R> ? R : never;
    } : never;
    type ProviderResolver<Dependencies, Provide> = (dependencies: Dependencies) => Provide | Promise<Provide>;
    export interface ProviderOptionsFrom {
        /** @default */
        isSingleton: boolean;
    }
    export interface ProviderOptionsCreate<Dependencies> {
        dependencies: Dependencies;
    }
    export default class Provider<_Provide = any, Dependencies = any, Resolver = any> {
        private readonly _dependencies;
        private readonly _resolver;
        private _isSingleton;
        private constructor();
        static create<Provide, Dependencies extends ProviderDependenciesBound>(options: ProviderOptionsCreate<Dependencies> & Partial<ProviderOptionsFrom>, resolver: ProviderResolver<ProviderDependenciesResolution<Dependencies>, Provide>): Provider<Provide, Dependencies, ProviderResolver<ProviderDependenciesResolution<Dependencies>, Provide>>;
        private applyOptionsFrom;
        from(options: Partial<ProviderOptionsFrom>): Provider<_Provide, Dependencies, Resolver>;
        get dependencies(): Readonly<Dependencies>;
        get resolver(): Resolver;
        get isSingleton(): boolean;
    }
}
