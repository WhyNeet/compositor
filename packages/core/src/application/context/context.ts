import { Container, Ctor, InjectionToken, RegistrationEntity } from "../../ioc";
import { ControllerSetupAspect, MetadataProcessorBean } from "../features";
import { APPLICATION_TOKEN } from "../tokens";

export class ApplicationContext {
  private _container: Container;

  constructor(container: Container) {
    this._container = container;
    this.register({
      token: APPLICATION_TOKEN.APPLICATION_CONTEXT,
      factory: () => this,
    });
    this.register({
      token: APPLICATION_TOKEN.METADATA_PROCESSOR,
      bean: MetadataProcessorBean,
    });
    this.register({
      token: APPLICATION_TOKEN.CONTROLLER_SETUP_ASPECT,
      bean: ControllerSetupAspect,
    });
  }

  public containerEvents() {
    return this._container.events();
  }

  public register<Bean extends Ctor>(entity: RegistrationEntity<Bean>) {
    this._container.register(entity);
  }

  public getBean<T>(token: InjectionToken): T {
    return this._container.getBean(token);
  }

  public bootstrap() {
    this._container.bootstrap();
  }
}
