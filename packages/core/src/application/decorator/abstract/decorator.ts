import { Ctor } from "../../../ioc";
import { METADATA_KEY } from "../../constants";
import { ClassDecorator } from "./class-decorator";

export function Decorator() {
  return function <
    T extends new (
      // biome-ignore lint/complexity/useArrowFunction: not using arrow function
      // biome-ignore lint/suspicious/noExplicitAny: any args
      ...args: any[]
    ) => { apply(...args: unknown[]): unknown },
  >(target: T) {
    const name = target.name;
    return class extends target {
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
  };
}
