import { DependencyRuntime, ProxyDependencyRuntime } from "./runtime/index";

async function main() {
  const deps = DependencyRuntime.create<{
    name: string;
    work: number;
  }>({
    name: {},
    work: {},
  });

  setTimeout(() => {
    deps.resolve("name", "kirill");
    deps.resolve("work", 42);
  }, 1500);

  const proxy = new ProxyDependencyRuntime({
    constructor: ({ name, work }) => {
      return {
        name,
        toStr: (prefix: string) => {
          return `${prefix}{{${name}, ${work}}}`;
        },
      };
    },
    configurate: {},
    container: deps,
  });

  const name = await proxy.get("name");
  const text = await proxy.get("toStr", "__text::");

  console.log("name", name);
  console.log("text", text);
}

main();
