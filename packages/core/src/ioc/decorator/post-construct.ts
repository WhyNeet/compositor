import { METADATA_KEY } from "../constants";
import { Ctor } from "../types";

export function PostConstruct(
  // biome-ignore lint/suspicious/noExplicitAny: allow any target
  target: any,
  propertyKey: string,
  _descriptor: PropertyDescriptor,
) {
  Reflect.defineMetadata(
    METADATA_KEY.IOC_POST_CONSTRUCT_METHOD,
    propertyKey,
    target.constructor,
  );
}
