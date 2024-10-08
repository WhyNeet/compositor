import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../../ioc";
import { METADATA_KEY } from "../../constants";
import { ApplicationContext } from "../../context";
import { Context, ProvisionedFactory } from "../../decorator";
import { getCtorToken } from "../../util";
import { Middleware } from "../middleware";
import { ControllerExceptionWrapper } from "./controller-setup-aspect";

export type HandlerPath = (string | HandlerPathEntity)[];
export type HandlerPathEntity = { token: unknown; data: unknown };

export type RawHandlerPath = string[];

@Bean()
export class HandlerSetupBean {
  constructor(@Context() private context: ApplicationContext) {}

  public setupHandler(
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

    wrapper.getInstance()[propertyKey] = async (
      request: unknown,
      response: unknown,
    ) => {
      const args = Array(provide.length).fill(null);

      for (const { factory, index } of provide) {
        args[index] = factory(request, response);
      }

      try {
        return await handler.bind(wrapper.getInstance())(...args);
      } catch (ex) {
        throw new ControllerExceptionWrapper(ex, request, response);
      }
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
      .map((mw) => getCtorToken(mw))
      .map(this.context.getBean.bind(this.context)) as Middleware[];

    for (let i = 0; i < middlewareBeans.length; i++)
      if (middlewareBeans[i] === null)
        throw new Error(
          `Middleware with name "${middlewares[i].name}" is not registered`,
        );

    const handler = wrapper.getInstance()[propertyKey];

    const middlewareChain = async (req: unknown, res: unknown) => {
      let idx = 0;

      const next = async (request?: unknown, response?: unknown) => {
        const mw = middlewareBeans[idx++];
        if (!mw) return await handler(request ?? req, response ?? res);
        return await mw.apply(request ?? req, response ?? res, next);
      };

      return await next();
    };

    wrapper.getInstance()[propertyKey] = middlewareChain;
  }
}
