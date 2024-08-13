import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";
import { ApplicationContext } from "../context";
import { Context, MetadataProcessor, ProvisionedFactory } from "../decorator";
import { getCtorToken } from "../util";
import { HandlerSetupBean } from "./handler-setup";
import { MetadataProcessorBean } from "./metadata-processor";
import { Middleware } from "./middleware";

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
