import { Ctor } from "../types";

export class NoBeanAnnotationError extends Error {
  constructor(ctor: Ctor) {
    super(`No @Bean annotation found on class "${ctor.name}"`);
  }
}
