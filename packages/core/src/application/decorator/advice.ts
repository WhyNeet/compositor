import { Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";

export function Advice(...decorators: unknown[]) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
  ) {
    Reflect.defineMetadata(
      METADATA_KEY.APPLICATION_ADVICE,
      decorators.map((decorator) =>
        Reflect.getOwnMetadata(METADATA_KEY.DECORATOR_INDENTIFIER, decorator),
      ),
      target,
    );
    Bean()(target);
  };
}
