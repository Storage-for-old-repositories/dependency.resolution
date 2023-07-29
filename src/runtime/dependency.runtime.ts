/**
 * Объект с параметрами каждой зависимости, в данный момент не используется, тоесть
 * конфиг для каждой зависимости пустой
 *
 * Ограничение `Name extends string` добавленно, чтобы иметь возможность передать
 * имя ключа (имя зависимости) в будущем. В данный момент тоже не испольуется
 */
export type DependenciesConfig<_Name extends string = string> = {};

const enum DependencyResolvingStatus {
  Process,
  Success,
  Fail,
}

export class DependencyRuntimeError extends Error {}

export class DependencyRuntime<Dependencies extends Record<string, any>> {
  private rejected: any;
  private dependencies: Record<string, any> = {};

  private resolvers: ((value: any) => void)[] = [];
  private rejectors: ((error: any) => void)[] = [];

  private status = DependencyResolvingStatus.Process;
  private constructor(private dependenciesNames: Set<string>) {}

  static create<Dependencies extends Record<string, any>>(dependencies: {
    [K in keyof Dependencies]: K extends string ? DependenciesConfig<K> : never;
  }) {
    const names = Object.keys(dependencies).filter(
      (key) => typeof key === "string"
    );
    const solver = new DependencyRuntime<Dependencies>(new Set(names));
    return solver;
  }

  isProcess() {
    return !this.isResolved();
  }

  isResolved() {
    return this.isResolvedSuccess() || this.isResolvedFail();
  }

  isResolvedSuccess() {
    return this.status == DependencyResolvingStatus.Success;
  }

  isResolvedFail() {
    return this.status == DependencyResolvingStatus.Fail;
  }

  resolve<K extends keyof Dependencies>(name: K, value: Dependencies[K]) {
    this.validateStatusIsProcess();
    this.validateDependencyIsProcess(name);

    this.dependencies[name as string] = value;
    this.dependenciesNames.delete(name as string);

    if (this.dependenciesNames.size > 0) {
      return;
    }

    this.status = DependencyResolvingStatus.Success;
    for (const resolve of this.resolvers) {
      resolve(this.dependencies);
    }
    this.stateClear();
  }

  reject(error: any) {
    this.validateStatusIsProcess();

    this.rejected = error;
    this.status = DependencyResolvingStatus.Fail;
    for (const reject of this.rejectors) {
      reject(error);
    }

    this.stateClear();
    this.dependencies = {};
  }

  toPromise() {
    if (this.isResolvedSuccess()) {
      return Promise.resolve(this.dependencies as Dependencies);
    }
    if (this.isResolvedFail()) {
      return Promise.reject<Dependencies>(this.rejected);
    }
    return new Promise<Dependencies>((resolve, reject) => {
      this.resolvers.push(resolve);
      this.rejectors.push(reject);
    });
  }

  async toPromiseTimeout(timeout: number) {
    return await Promise.race([
      this.toPromise(),
      new Promise<Dependencies>((_, reject) =>
        setTimeout(() => reject(new Error("time is over")), timeout)
      ),
    ]);
  }

  private validateStatusIsProcess() {
    if (!this.isProcess()) {
      throw new DependencyRuntimeError("resolving process is end");
    }
  }

  private validateDependencyIsProcess(name: keyof Dependencies) {
    if (!this.dependenciesNames.has(name as string)) {
      throw new DependencyRuntimeError(
        `resolving process dependency "${name as string}" is end`
      );
    }
  }

  private stateClear() {
    this.resolvers = [];
    this.rejectors = [];
    this.dependenciesNames.clear();
  }
}
