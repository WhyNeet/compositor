import { METADATA_KEY } from "./constants";

export function Decorator() {
  return function <
    T extends new (
      // biome-ignore lint/complexity/useArrowFunction: not using arrow function
      // biome-ignore lint/suspicious/noExplicitAny: any args
      ...args: any[]
    ) => { apply(...args: unknown[]): unknown },
  >(target: T) {
    const name = target.name;
    const ctor = class extends target {
      apply(
        target: unknown,
        propertyKey?: string,
        descriptor?: PropertyDescriptor,
      ) {
        Reflect.defineMetadata(
          name,
          1,
          propertyKey ? target.constructor : target,
        );
        super.apply(target, propertyKey, descriptor);
        return target;
      }
    };

    Reflect.defineMetadata(METADATA_KEY.DECORATOR_IDENTIFIER, name, ctor);

    return ctor;
  };
}
