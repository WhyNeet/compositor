import { Container, Ctor, InjectionToken, RegistrationEntity } from "../../ioc";
import { APPLICATION_TOKEN } from "../constants";
import { ControllerSetupAspect, MetadataProcessorBean } from "../features";
import { AdviceSetup } from "../features/advice-setup";
import { HandlerSetupBean } from "../features/handler-setup";

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
    this.register({ bean: HandlerSetupBean });
    this.register({ bean: AdviceSetup });
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
