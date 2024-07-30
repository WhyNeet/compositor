import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";
import { Ctor, FieldArg } from "../types";

// biome-ignore lint/suspicious/noExplicitAny: allow any target
export function Autowired(target: any, propertyKey: string) {
  const propertyType: Ctor = Reflect.getOwnMetadata(
    METADATA_KEY.DESIGN_TYPE,
    target,
    propertyKey,
  );
  const propertyToken: InjectionToken = propertyType.name;

  const fieldDependencies: FieldArg[] =
    Reflect.getOwnMetadata(METADATA_KEY.IOC_FIELD_ARGS, target.constructor) ??
    [];
  fieldDependencies.push({ token: propertyToken, property: propertyKey });
  Reflect.defineMetadata(
    METADATA_KEY.IOC_FIELD_ARGS,
    fieldDependencies,
    target.constructor,
  );
}
