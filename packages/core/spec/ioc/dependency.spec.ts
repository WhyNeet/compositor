import { Dependency } from "../../src/ioc/dependency";

class Example {
  public message = "hello world";
}

describe("Dependency", () => {
  it("should be immediately instantiated if not lazy", () => {
    const dependency = new Dependency(() => new Example());

    expect(
      (dependency as unknown as Record<string, unknown>)[
        "_instance"
      ] as InstanceType<typeof Example>,
    ).toBeInstanceOf(Example);
  });

  it("should only be instantiated after first access if lazy", () => {
    const dependency = new Dependency<typeof Example>(() => new Example(), {
      lazy: true,
    });

    expect(
      (dependency as unknown as Record<string, unknown>)[
        "_instance"
      ] as InstanceType<typeof Example>,
    ).toBeNull();

    dependency.getInstance().message; // access an instance variable

    // must be an instance of Example after first access
    expect(
      (dependency as unknown as Record<string, unknown>)[
        "_instance"
      ] as InstanceType<typeof Example>,
    ).toBeInstanceOf(Example);
  });
});
