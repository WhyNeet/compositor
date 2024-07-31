import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";

export function Qualifier(qualifier: InjectionToken) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
    propertyKey?: string | symbol,
    parameterIndex?: number,
  ) {
    // if applied on a class field
    if (propertyKey)
      return Reflect.defineMetadata(
        METADATA_KEY.IOC_QUALIFIER,
        qualifier,
        target.constructor,
        propertyKey,
      );

    const paramsLength: number = Reflect.getOwnMetadata(
      METADATA_KEY.DESIGN_PARAM_TYPES,
      target,
    ).length;
    const paramMapping: InjectionToken[] =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_FACTORY_PARAM_MAP, target) ??
      Array(paramsLength);
    paramMapping[parameterIndex] = qualifier;
    Reflect.defineMetadata(
      METADATA_KEY.IOC_FACTORY_PARAM_MAP,
      paramMapping,
      target,
    );
  };
}
