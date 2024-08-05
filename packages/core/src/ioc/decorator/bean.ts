import { METADATA_KEY } from "../constants";
import { Ctor } from "../types";

export function Bean() {
  // biome-ignore lint/complexity/useArrowFunction: stick to normal function
  // biome-ignore lint/suspicious/noExplicitAny: any args
  return function <T extends abstract new (...args: any) => unknown>(
    target: T,
  ) {
    const dependencies: Ctor[] =
      Reflect.getOwnMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) ?? [];
    Reflect.defineMetadata(
      METADATA_KEY.IOC_FACTORY_ARGS,
      dependencies.map((dependency) => dependency?.name),
      target,
    );

    return target;
  };
}
