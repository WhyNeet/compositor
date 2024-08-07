import { Container, Ctor, InjectionToken, METADATA_KEY } from "../../ioc";
import { ControllerSetupAspect, MetadataProcessor } from "../features";
import { APPLICATION_TOKEN } from "../tokens";
import { getCtorToken } from "../util";

export class ApplicationContext {
  private _container: Container;

  constructor(container: Container) {
    this._container = container;
    this._container.registerFactory(
      APPLICATION_TOKEN.APPLICATION_CONTEXT,
      () => this,
    );
    this.registerCtor(APPLICATION_TOKEN.METADATA_PROCESSOR, MetadataProcessor);
    this.registerCtor(
      APPLICATION_TOKEN.CONTROLLER_SETUP_ASPECT,
      ControllerSetupAspect,
    );
  }

  public containerEvents() {
    return this._container.events();
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
        getCtorToken(tokenOrCtor as Ctor),
        tokenOrCtor as Ctor,
      );
  }

  public bootstrap() {
    this._container.bootstrap();
  }
}
