import { METADATA_KEY } from "../constants";
import { Middleware as AbstractMiddleware } from "../features";

export function UseMiddleware(middleware: {
  // biome-ignore lint/suspicious/noExplicitAny: any middleware constructor
  new (...args: any[]): AbstractMiddleware;
}) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const key = METADATA_KEY.HANDLER_MIDDLEWARE(propertyKey);
    const middlewares: AbstractMiddleware[] =
      Reflect.getOwnMetadata(key, target.constructor) ?? [];
    middlewares.push(middleware);
    Reflect.defineMetadata(key, middlewares, target.constructor);
  };
}
