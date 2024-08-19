import { Ctor } from "../../../ioc";

export abstract class ClassDecorator {
  abstract apply<T extends Ctor>(target: T): void;
}
