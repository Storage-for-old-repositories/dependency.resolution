const TOKEN_HACK_TYPE = Symbol("TOKEN_HACK_TYPE");

class NotPossibleError extends Error {}

export default abstract class AbstractProvider<Provide = any> {
  protected [TOKEN_HACK_TYPE](): Provide {
    throw new NotPossibleError();
  }
}
