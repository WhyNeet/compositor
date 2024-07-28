import { Bean, Container } from "../../src";

@Bean()
class B {
  public printMessage(message: string) {
    message;
  }
}

@Bean()
class A {
  public message = "hello world";

  constructor(private b: B) {
    expect(b).toBeInstanceOf(B);
  }
}

@Bean()
class C {
  constructor(
    private a: A,
    private b: B,
  ) {
    expect(a).toBeInstanceOf(A);
    expect(b).toBeInstanceOf(B);
    b.printMessage(a.message);
  }
}

describe("Container", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("should wire beans correctly", () => {
    container.registerCtor("A", A);
    container.registerCtor("B", B);
    container.registerCtor("C", C);

    container.bootstrap();
  });
});
