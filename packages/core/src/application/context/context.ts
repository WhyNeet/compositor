import { Container, Ctor, InjectionToken, RegistrationEntity } from "../../ioc";
import { Application } from "../application";
import { APPLICATION_TOKEN } from "../constants";
import { ControllerSetupAspect, MetadataProcessorBean } from "../features";
import { HandlerSetupBean } from "../features";

export class ApplicationContext {
  private _container: Container;
  private _application: Application;

  constructor(container: Container, application: Application) {
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
    this.register({ bean: HandlerSetupBean });
    this._application = application;
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

  public applicationEvents() {
    return this._application.events();
  }

  public wire() {
    this._container.wire();
  }

  public bootstrap() {
    this._container.bootstrap();
  }
}
