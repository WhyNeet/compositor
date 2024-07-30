import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";
import { Ctor, FieldArg } from "../types";

export function Autowired(qualifier?: InjectionToken) {
  // biome-ignore lint/complexity/useArrowFunction: not using arrow function
  // biome-ignore lint/suspicious/noExplicitAny: allow any target
  return function (target: any, propertyKey: string) {
    const propertyType: Ctor = Reflect.getOwnMetadata(
      METADATA_KEY.DESIGN_TYPE,
      target,
      propertyKey,
    );
    const propertyToken: InjectionToken = propertyType.name;

    const fieldDependencies: FieldArg[] =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_FIELD_ARGS, target.constructor) ??
      [];
    fieldDependencies.push({
      token: qualifier ?? propertyToken,
      property: propertyKey,
    });
    Reflect.defineMetadata(
      METADATA_KEY.IOC_FIELD_ARGS,
      fieldDependencies,
      target.constructor,
    );
  };
}
