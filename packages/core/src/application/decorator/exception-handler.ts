import { METADATA_KEY } from "../constants";

export function ExceptionHandler(
  // biome-ignore lint/suspicious/noExplicitAny: suppress type error
  ...exceptions: { new (...args: any[]): Error }[]
) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const handlers: unknown[] =
      Reflect.getOwnMetadata(
        METADATA_KEY.ADVICE_EXCEPTION_HANDLERS,
        target.constructor,
      ) ?? [];
    handlers.push({ key: propertyKey, exceptions });
    Reflect.defineMetadata(
      METADATA_KEY.ADVICE_EXCEPTION_HANDLERS,
      handlers,
      target.constructor,
    );
  };
}
