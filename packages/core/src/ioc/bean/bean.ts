import { Ctor } from "../types";
import { BeanDefinition } from "./bean-definition";

export class Bean<T extends Ctor> {
  private _factory: () => InstanceType<T>;
  private _instance: InstanceType<T> | null = null;
  private _lazy: boolean;

  constructor(definition: BeanDefinition<T>) {
    this._lazy = definition.isLazy();
    this._factory =
      definition.getFactory() ??
      (() =>
        // biome-ignore lint/suspicious/noExplicitAny: suppress ts error
        Reflect.construct<any[], InstanceType<T>>(
          definition.getClass(),
          definition.getBeans().map((bean) => bean.getInstance()),
        ));

    if (!this._lazy) this.instantiate();
  }

  public getInstance(): InstanceType<T> {
    if (this._lazy)
      return new Proxy(
        {},
        {
          get: (target, prop, recv) => {
            if (!this._instance) this.instantiate();
            // biome-ignore lint/complexity/noBannedTypes: must be an object
            return Reflect.get(this._instance as Object, prop, recv);
          },
        },
      ) as InstanceType<T>;
    // biome-ignore lint/style/noNonNullAssertion: cannot be null here
    return this._instance!;
  }

  private instantiate() {
    this._instance = this._factory();
  }
}

// biome-ignore lint/suspicious/noExplicitAny: must use any
export type AnyBean = Bean<any>;
