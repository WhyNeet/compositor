import { METADATA_KEY } from "../constants";

export function Handler(...path: unknown[]) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(
      METADATA_KEY.CONTROLLER_HANDLER,
      path,
      target.constructor,
      propertyKey,
    );
    const handlers: string[] =
      Reflect.getOwnMetadata(
        METADATA_KEY.CONTROLLER_HANDLERS,
        target.constructor,
      ) ?? [];
    handlers.push(propertyKey);
    Reflect.defineMetadata(
      METADATA_KEY.CONTROLLER_HANDLERS,
      handlers,
      target.constructor,
    );
  };
}
