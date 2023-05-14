import { ArleadyBindProviderError } from "./errors";
import AbstractProvider from "./abstract.provider";
import type Provider from "./provider";

declare global {
  namespace dependencyResolution {
    interface GlobalNames {}
  }
}

const bindsProviders = new Map<
  keyof dependencyResolution.GlobalNames,
  Provider<unknown>
>();

type ProvidersAll = {
  [Token in keyof dependencyResolution.GlobalNames]: Provider<
    dependencyResolution.GlobalNames[Token]
  >;
};

export default class ProviderByName<Provide> extends AbstractProvider<Provide> {
  private constructor(private readonly _token: string) {
    super();
  }

  static create<Token extends keyof dependencyResolution.GlobalNames>(
    token: Token
  ) {
    return new ProviderByName<dependencyResolution.GlobalNames[Token]>(token);
  }

  static bindProvider<
    Token extends keyof dependencyResolution.GlobalNames,
    P extends Provider<dependencyResolution.GlobalNames[Token]>
  >(token: Token, provider: P) {
    if (bindsProviders.has(token)) {
      throw new ArleadyBindProviderError();
    }
    bindsProviders.set(token, provider);
  }

  static getBindsProviders() {
    const binds: Partial<
      Record<keyof dependencyResolution.GlobalNames, Provider<unknown>>
    > = {};
    for (const [key, provide] of bindsProviders) {
      binds[key] = provide;
    }
    return binds as Partial<ProvidersAll>;
  }

  get token() {
    return this._token;
  }
}
