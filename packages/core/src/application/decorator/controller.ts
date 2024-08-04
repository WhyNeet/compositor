import { METADATA_KEY } from "../constants";

export function Controller(path: string) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target
    target: any,
  ) {
    Reflect.defineMetadata(METADATA_KEY.APPLICATION_CONTROLLER, path, target);
  };
}
