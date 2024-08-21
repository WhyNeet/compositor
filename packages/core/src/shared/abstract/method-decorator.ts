import { Ctor } from "../../ioc";

export abstract class MethodDecorator {
  abstract apply<T extends Ctor>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void;
}
