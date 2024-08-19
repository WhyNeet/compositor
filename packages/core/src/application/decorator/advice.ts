import { Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";

export function Advice(...entities: Ctor[]) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
  ) {
    Reflect.defineMetadata(METADATA_KEY.APPLICATION_ADVICE, entities, target);
    Bean()(target);
  };
}
