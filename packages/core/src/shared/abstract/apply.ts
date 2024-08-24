import { ClassDecorator, MethodDecorator } from "../../shared";

export function Apply<T extends unknown[]>(
  decorator: { new (args: T): ClassDecorator<T> | MethodDecorator<T> },
  ...args: T
) {
  return function (
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: prevent type errors
    return new decorator(args).apply(target, propertyKey, descriptor) as any;
  };
}
