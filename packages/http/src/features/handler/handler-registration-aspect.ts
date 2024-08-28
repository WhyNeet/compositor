import {
  APP_METADATA_KEY,
  AnyBeanDefinition,
  AnyBeanWrapper,
  Application,
  ApplicationContext,
  ApplicationEvent,
  Bean,
  ContainerEvent,
  Context,
  HandlerPath,
  MetadataProcessor,
  MetadataProcessorBean,
} from "@compositor/core";
import {
  DefaultHttpRequest,
  DefaultHttpResponse,
  HttpMethod,
} from "@compositor/http";
import { HttpMapper } from "../../abstracts";
import {
  HttpRouter,
  RequestMapper,
  ResponseMapper,
  Server,
} from "../../decorators";
import { Router } from "../router";

@Bean()
export class HandlerRegistrationAspect {
  constructor(
    @MetadataProcessor() metadataProcessor: MetadataProcessorBean,
    @HttpRouter() private router: Router,
    @Context() cx: ApplicationContext,
  ) {
    cx.applicationEvents().subscribe(
      ApplicationEvent.HandlersPreparationFinished,
      () => {
        metadataProcessor.addHandler(
          APP_METADATA_KEY.APPLICATION_CONTROLLER,
          this.registerHandlers.bind(this),
        );
      },
    );
  }

  private registerHandlers(def: AnyBeanDefinition, wrapper: AnyBeanWrapper) {
    const handlerKeys: (string | symbol)[] = Reflect.getOwnMetadata(
      APP_METADATA_KEY.CONTROLLER_HANDLERS,
      def.getClass(),
    );

    const pathPrefix = Reflect.getOwnMetadata(
      APP_METADATA_KEY.APPLICATION_CONTROLLER,
      def.getClass(),
    ) as unknown[];

    const handlers = handlerKeys
      .map((key) => ({
        handler: wrapper.getInstance()[key] as (
          req: unknown,
          res: unknown,
        ) => unknown,
        key,
      }))
      .map(({ handler, key }) => ({
        handler,
        path: pathPrefix.concat(
          Reflect.getOwnMetadata(
            APP_METADATA_KEY.CONTROLLER_HANDLER,
            def.getClass(),
            key,
          ) as unknown[],
        ),
      }));

    for (const { handler: controllerHandler, path } of handlers) {
      const handler = async (
        request: DefaultHttpRequest,
        response: DefaultHttpResponse,
      ) => {
        const result = await controllerHandler(request, response);
        if (typeof result === "string") response.body.text(result);
        else if (typeof result === "object")
          response.body.json(result as Record<string, unknown>);
      };

      this.router.registerHandler(path as HandlerPath, handler);
    }
  }
}
