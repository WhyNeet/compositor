import { Autowired, Bean, Container, Late, Qualifier } from "../../src";

@Bean()
class B {
  @Autowired
  @Qualifier("A")
  private a: unknown;

  public printMessage(message: string) {
    message;
  }
}

@Bean()
@Late()
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
    expect(a.message).toBe("hello world");
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
    container.register({ bean: A });
    container.register({ bean: B });
    container.register({ bean: C });

    container.bootstrap();
  });
});
