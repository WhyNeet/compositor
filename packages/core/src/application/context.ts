import { Container, Ctor, InjectionToken, METADATA_KEY } from "../ioc";
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

  public registerFactory(token: InjectionToken, factory: () => unknown) {
    this._container.registerFactory(token, factory);
  }

  public registerCtor(token: InjectionToken, ctor: Ctor): void;
  public registerCtor(ctor: Ctor): void;

  public registerCtor(tokenOrCtor: InjectionToken | Ctor, ctor?: Ctor): void {
    if (ctor) this._container.registerCtor(tokenOrCtor as InjectionToken, ctor);
    else
      this._container.registerCtor(
        Reflect.getOwnMetadata(METADATA_KEY.DESIGN_TYPE, tokenOrCtor),
        tokenOrCtor as Ctor,
      );
  }
}
