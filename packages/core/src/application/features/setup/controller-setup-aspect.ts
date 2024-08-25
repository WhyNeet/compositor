import { AnyBeanDefinition, AnyBeanWrapper, Bean } from "../../../ioc";
import { METADATA_KEY } from "../../constants";
import { ApplicationContext } from "../../context";
import { Context, MetadataProcessor } from "../../decorator";
import { MetadataProcessorBean } from "../metadata-processor";
import { HandlerSetupBean } from "./handler-setup";

@Bean()
export class ControllerSetupAspect {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
    @Context() private context: ApplicationContext,
    private handlerSetup: HandlerSetupBean,
  ) {
    this.metadataProcessor.addHandler(
      METADATA_KEY.APPLICATION_CONTROLLER,
      this.setupController.bind(this),
    );
  }

  private setupController(def: AnyBeanDefinition, wrapper: AnyBeanWrapper) {
    const handlers = Reflect.getOwnMetadata(
      METADATA_KEY.CONTROLLER_HANDLERS,
      def.getClass(),
    );
    for (const handler of handlers)
      this.handlerSetup.setupHandler(def, wrapper, handler);
  }
}

export class ControllerExceptionWrapper {
  constructor(
    private _error: Error,
    private _request: unknown,
    private _response: unknown,
  ) {}

  public error() {
    return this._error;
  }
  public request() {
    return this._request;
  }
  public response() {
    return this._response;
  }
}
