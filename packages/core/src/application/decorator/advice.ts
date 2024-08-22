import { Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../../shared";
import { METADATA_KEY as APP_METADATA_KEY } from "../constants";

export function Advice(...decorators: Ctor[]) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
  ) {
    Reflect.defineMetadata(
      APP_METADATA_KEY.APPLICATION_ADVICE,
      decorators.map((decorator) =>
        Reflect.getOwnMetadata(METADATA_KEY.DECORATOR_IDENTIFIER, decorator),
      ),
      target,
    );
    Bean()(target);
  };
}
