import { Container, Ctor } from "../ioc";
import { APPLICATION_TOKEN } from "./tokens";
import { getCtorToken } from "./util";

export class ApplicationContext {
  private _container: Container;

  constructor(container: Container) {
    this._container = container;
    this._container.registerFactory(
      APPLICATION_TOKEN.APPLICATION_CONTEXT,
      () => this,
    );
  }

  public root<T extends Ctor>(root: T) {
    this._container.registerCtor(getCtorToken(root), root);
  }
}
