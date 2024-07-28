import { BeanScope } from "../bean";
import { METADATA_KEY } from "../constants";

export function Scope(scope: BeanScope) {
  // biome-ignore lint/complexity/useArrowFunction: stick to normal function
  // biome-ignore lint/suspicious/noExplicitAny: any args
  return function <T extends abstract new (...args: any) => unknown>(
    target: T,
  ) {
    Reflect.defineMetadata(METADATA_KEY.IOC_SCOPE, scope, target);

    return target;
  };
}
