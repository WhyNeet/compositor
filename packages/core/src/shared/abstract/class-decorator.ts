import { Ctor } from "../../ioc";

export abstract class ClassDecorator<Args extends unknown[]> {
  private _args: Args;

  constructor(args: Args) {
    this._args = args;
  }

  protected args() {
    return this._args;
  }

  abstract apply<T extends Ctor>(target: T): void;
}
