import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../ioc";
import { METADATA_KEY as IOC_METADATA_KEY } from "../../ioc";
import { METADATA_KEY } from "../constants";
import { ApplicationContext } from "../context";
import { Context, MetadataProcessor, ProvisionedFactory } from "../decorator";
import { MetadataProcessorBean } from "./metadata-processor";
import { Middleware } from "./middleware";

@Bean()
export class ControllerSetupAspect {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
    @Context() private context: ApplicationContext,
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
    for (const handler of handlers) this.setupHandler(def, wrapper, handler);
  }

  private setupHandler(
    def: AnyBeanDefinition,
    wrapper: AnyBeanWrapper,
    propertyKey: string,
  ) {
    this.prepareParamDecorators(def, wrapper, propertyKey);
    this.prepareMiddleware(def, wrapper, propertyKey);
  }

  private prepareParamDecorators(
    def: AnyBeanDefinition,
    wrapper: AnyBeanWrapper,
    propertyKey: string,
  ) {
    const provide: ProvisionedFactory[] =
      Reflect.getOwnMetadata(propertyKey, def.getClass()) ?? [];
    const handler = wrapper.getInstance()[propertyKey];

    wrapper.getInstance()[propertyKey] = (
      request: unknown,
      response: unknown,
    ) => {
      const args = Array(provide.length).fill(null);

      for (const { factory, index } of provide) {
        args[index] = factory(request, response);
      }

      handler(...args);
    };
  }

  private prepareMiddleware(
    def: AnyBeanDefinition,
    wrapper: AnyBeanWrapper,
    propertyKey: string,
  ) {
    const middlewares: Ctor[] =
      Reflect.getOwnMetadata(
        METADATA_KEY.HANDLER_MIDDLEWARE(propertyKey),
        def.getClass(),
      ) ?? [];

    if (!middlewares.length) return;

    const middlewareBeans: Middleware[] = middlewares
      .map((mw) => Reflect.getOwnMetadata(IOC_METADATA_KEY.DESIGN_TYPE, mw))
      .map(this.context.getBean) as Middleware[];

    for (let i = 0; i < middlewareBeans.length; i++)
      if (middlewareBeans[i] === null)
        throw new Error(
          `Middleware with name "${middlewares[i].name}" is not registered`,
        );

    const chainMiddlewares = (
      idx: number,
    ): ((req: unknown, res: unknown) => void) => {
      const apply = middlewareBeans[idx].apply;
      middlewareBeans[idx].apply = (req: unknown, res: unknown) =>
        apply(
          req,
          res,
          idx === middlewareBeans.length - 1
            ? wrapper.getInstance()[propertyKey]
            : () => chainMiddlewares(idx + 1)(req, res),
        );
      return middlewareBeans[idx].apply as ReturnType<typeof chainMiddlewares>;
    };

    wrapper.getInstance()[propertyKey] = chainMiddlewares(0);
  }
}
