import { DependencyRuntime } from "../src/runtime";
import { suite, test, timeout } from "@testdeck/mocha";
import * as _chai from "chai";

const expectThrowsAsync = async (
  method: () => Promise<any>,
  errorMessage?: string
) => {
  let error: null | Error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an("Error");
  if (errorMessage) {
    expect(error?.message).to.equal(errorMessage);
  }
};

const awaittimeout = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(undefined), time);
  });

_chai.should();
const expect = _chai.expect;

///

type DRSuccessType = {
  timeout_1000: "Hello World";
  timeout_2000: string[];
  timeout_3000: number;
};

@suite
class DependenciesRuntimeTest {
  private dependencies: DependencyRuntime<DRSuccessType>;

  before() {
    this.dependencies = DependencyRuntime.create<DRSuccessType>({
      timeout_1000: {},
      timeout_2000: {},
      timeout_3000: {},
    });

    setTimeout(() => {
      try {
        this.dependencies.resolve("timeout_1000", "Hello World");
      } catch {}
    }, 1000);
    setTimeout(() => {
      try {
        this.dependencies.resolve("timeout_2000", ["This", "is", "work"]);
      } catch {}
    }, 2000);
    setTimeout(() => {
      try {
        this.dependencies.resolve("timeout_3000", 1688121907562);
      } catch {}
    }, 3000);
  }

  @test
  async "test status in process"() {
    expect(this.dependencies.isProcess()).equal(true);
  }

  @test
  "exception provide not exists dependency"() {
    expect(
      this.dependencies.resolve.bind(
        this.dependencies,
        "wow" as any,
        null as any
      )
    ).to.throw();
  }

  @test
  @timeout(3500)
  async "receiving in process"() {
    const value = await this.dependencies.toPromise();
    expect(value).deep.equal({
      timeout_1000: "Hello World",
      timeout_2000: ["This", "is", "work"],
      timeout_3000: 1688121907562,
    });
  }

  @test
  @timeout(4000)
  async "test status success"() {
    await awaittimeout(3500);

    expect(this.dependencies.isResolvedSuccess()).equal(true);
  }

  @test
  @timeout(4000)
  async "receiving after process"() {
    await awaittimeout(3500);

    const value = await this.dependencies.toPromise();
    expect(value).deep.equal({
      timeout_1000: "Hello World",
      timeout_2000: ["This", "is", "work"],
      timeout_3000: 1688121907562,
    });
  }

  @test
  @timeout(4000)
  async "exception after process when using [resolve]"() {
    await awaittimeout(3500);

    expect(
      this.dependencies.resolve.bind(
        this.dependencies,
        "timeout_1000",
        "Hello World"
      )
    ).to.throw();
  }

  @test
  @timeout(4000)
  async "exception after process when using [reject]"() {
    await awaittimeout(3500);

    expect(
      this.dependencies.reject.bind(this.dependencies, new Error())
    ).to.throw();
  }

  @test
  "reject by start [check status]"() {
    this.dependencies.reject(new Error("reject by start"));
    expect(this.dependencies.isResolvedFail()).equal(true);
  }

  @test
  "reject by start [check toPromise]"() {
    this.dependencies.reject(new Error("reject by start"));
    expectThrowsAsync(
      this.dependencies.toPromise.bind(this.dependencies, "reject by start")
    );
  }

  @test
  async "reject by 1000 ms"() {
    await awaittimeout(1000);

    this.dependencies.reject(new Error("reject by 1000 ms"));
    expectThrowsAsync(
      this.dependencies.toPromise.bind(
        this.dependencies.toPromise,
        "reject by 1000 ms"
      )
    );
  }

  @test
  async "reject in process"() {
    const value = this.dependencies.toPromise();

    await awaittimeout(1000);
    this.dependencies.reject(new Error("reject in process"));
    expectThrowsAsync(() => value, "reject in process");
  }
}
