import { IProvider } from "./index";

declare global {
  namespace dependencyResolution {
    interface GlobalNames {}
  }
}

export default class ProviderByName<Provide> extends IProvider<Provide> {
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
