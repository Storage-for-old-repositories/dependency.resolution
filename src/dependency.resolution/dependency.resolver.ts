import AbstractProvider from "./abstract.provider";
import {
  AbsentAbstractProviderHookError,
  AbsentBindProviderError,
} from "./errors";
import { Chain, GraphNode } from "./helpers/index";
import Provider from "./provider";
import ProviderByName from "./provider.by.name";

type GraphProviderChain = Chain<Provider, GraphProviderGraphNode>;
type GraphProviderGraphNode = GraphNode<{
  chain: GraphProviderChain;
  provider: Provider;
}>;
type GraphCouplePair = {
  parentNode: GraphProviderGraphNode;
  provider: Provider;
};

class GraphProvider {
  private readonly _graph: GraphProviderGraphNode = GraphNode.create({
    chain: Chain.create(),
    provider: Provider.create({ dependencies: {} }, () => {
      // TODO: create root provider
    }),
  });

  private get _chain() {
    return this._graph.value.chain;
  }

  public has(provider: Provider) {
    return this._chain.has(provider);
  }

  public add(provider: Provider) {
    if (this._chain.has(provider)) {
      return this._chain.get(provider)!;
    } else {
      return this._graph.growNode({
        provider,
        chain: this._chain,
      });
    }
  }

  public bind({ parentNode, provider }: GraphCouplePair) {
    if (this._chain.has(provider)) {
      const childNode = this._chain.get(provider)!;
      const childChain = childNode.value.chain;
      const parentProvider = parentNode.value.provider;

      if (childChain.has(parentProvider)) {
        throw new Error();
      }

      this.bindParentNodeToChildNode(parentNode, childNode);
      return childNode;
    } else {
      const childNode = GraphNode.create({
        provider,
        chain: parentNode.value.chain.forkChain(),
      });
      this.bindParentNodeToChildNode(parentNode, childNode);
      return childNode;
    }
  }

  private bindParentNodeToChildNode(
    parent: GraphProviderGraphNode,
    child: GraphProviderGraphNode
  ) {
    const childProvider = child.value.provider;
    const parentChain = parent.value.chain;

    parentChain.add(childProvider, child);
    parent.appendNode(child);
  }
}

type Dependency = {
  parentNode: GraphProviderGraphNode | null;
  rawProvider: AbstractProvider | keyof dependencyResolution.GlobalNames;
};

export default class DependencyResolver {
  private readonly _bindsProviders = ProviderByName.getBindsProviders();
  private readonly _dependenciesStack: Dependency[] = [];

  private constructor(private readonly _dependencies: AbstractProvider[]) {}

  public static async resolve(dependencies: AbstractProvider[]): Promise<void> {
    const resolver = new DependencyResolver([...dependencies]);
    return await resolver.resolve();
  }

  private pushDependencies(
    rawProviders: Dependency["rawProvider"][],
    parentNode: Dependency["parentNode"] = null
  ) {
    for (const rawProvider of rawProviders) {
      this._dependenciesStack.push({
        rawProvider,
        parentNode,
      });
    }
  }

  private pushDependenciesFromProvider(
    provider: Provider,
    parentNode: Dependency["parentNode"] = null
  ) {
    return this.pushDependencies(Object.values(provider), parentNode);
  }

  private async resolve() {
    const graph = new GraphProvider();

    this.pushDependencies(this._dependencies);
    while (this._dependenciesStack.length > 0) {
      const { parentNode, rawProvider } = this._dependenciesStack.pop()!;
      const provider = this.extractProvider(rawProvider);
      const childNode = parentNode
        ? graph.bind({ parentNode, provider })
        : graph.add(provider);

      this.pushDependenciesFromProvider(provider, childNode);
    }
    // const initialProviders = this._dependencies.map((dependency) =>
    //   this.extractProvider(dependency)
    // );
  }

  private extractProvider(
    abstractProvider: AbstractProvider | keyof dependencyResolution.GlobalNames
  ): Provider {
    if (abstractProvider instanceof AbstractProvider) {
      return this.extractProviderFromAbstractProvider(abstractProvider);
    }
    return this.extractProviderFromGlobalName(abstractProvider);
  }

  private extractProviderFromAbstractProvider(
    abstractProvider: AbstractProvider
  ): Provider {
    if (abstractProvider instanceof Provider) {
      return abstractProvider;
    }
    if (abstractProvider instanceof ProviderByName) {
      return this.extractProviderFromGlobalName(abstractProvider.token);
    }
    throw new AbsentAbstractProviderHookError();
  }

  private extractProviderFromGlobalName(
    globalName: keyof dependencyResolution.GlobalNames
  ): Provider {
    const provider = this._bindsProviders[globalName];
    if (provider) {
      return provider;
    }
    throw new AbsentBindProviderError();
  }
}
