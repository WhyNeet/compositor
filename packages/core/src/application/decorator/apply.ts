import { ClassDecorator, MethodDecorator } from "./abstract";

export function Apply(...decorators: (ClassDecorator | MethodDecorator)[]) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    for (const decorator of decorators)
      decorator.apply(target, propertyKey, descriptor);
  };
}
