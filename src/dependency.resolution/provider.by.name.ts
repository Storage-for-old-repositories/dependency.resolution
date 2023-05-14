import AbstractProvider from "./abstract.provider";

declare global {
  namespace dependencyResolution {
    interface GlobalNames {}
  }
}

export default class ProviderByName<Provide> extends AbstractProvider<Provide> {
  private constructor(private readonly _token: string) {
    super();
  }

  static create<Token extends keyof dependencyResolution.GlobalNames>(
    token: Token
  ) {
    return new ProviderByName<dependencyResolution.GlobalNames[Token]>(token);
  }

  get token() {
    return this._token;
  }
}
