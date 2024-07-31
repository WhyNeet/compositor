import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";

export function Qualifier(qualifier: InjectionToken) {
  // biome-ignore lint/complexity/useArrowFunction: not using arrow function
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      METADATA_KEY.IOC_QUALIFIER,
      qualifier,
      target.constructor,
      propertyKey,
    );
  };
}
