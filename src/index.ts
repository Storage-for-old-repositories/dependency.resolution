import { Provider, ProviderByName } from "dependency.resolution/index";

const provide = Provider.create(
  {
    dependencies: {
      message: Provider.create(
        {
          dependencies: {},
        },
        async () => "Hello world" as const
      ),
      user: ProviderByName.create("user"),
      file: ProviderByName.create("file"),
      car: "file",
      wow: "user",
    },
    config: {
      work: "sdf",
    },
  },
  async (d, c) => {}
);
