import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";
import { MetadataProcessor, ProvisionedFactory } from "../decorator";
import { MetadataProcessor as MP } from "./metadata-processor";

export interface HandlerData {
  request: unknown;
  response: unknown;
}

@Bean()
export class ControllerSetupAspect {
  constructor(@MetadataProcessor() private metadataProcessor: MP) {
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
    for (const handler of handlers) this.setupHandler(def, wrapper, handler);
  }

  private setupHandler(
    def: AnyBeanDefinition,
    wrapper: AnyBeanWrapper,
    propertyKey: string,
  ) {
    this.prepareParamDecorators(def, wrapper, propertyKey);
  }

  private prepareParamDecorators(
    def: AnyBeanDefinition,
    wrapper: AnyBeanWrapper,
    propertyKey: string,
  ) {
    const provide: ProvisionedFactory[] = Reflect.getOwnMetadata(
      propertyKey,
      def.getClass(),
    );
    const handler = wrapper.getInstance()[propertyKey];

    return (data: HandlerData) => {
      const args = Array(provide.length).fill(null);

      for (const { factory, index } of provide) {
        args[index] = factory(data.request, data.response);
      }

      handler(...args);
    };
  }
}
