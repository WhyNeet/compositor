import { Ctor } from "./types";

export class Dependency<T extends Ctor> {
  private _factory: () => InstanceType<T>;
  private _instance: InstanceType<T> | null;

  constructor(factory: () => InstanceType<T>) {
    this._factory = factory;
  }

  public getInstance() {
    return this._instance;
  }

  public instantiate() {
    this._instance = this._factory();
  }
}
