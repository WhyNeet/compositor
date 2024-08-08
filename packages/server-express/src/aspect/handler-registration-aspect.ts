import {
  APP_METADATA_KEY,
  AnyBeanDefinition,
  AnyBeanWrapper,
  Bean,
  MetadataProcessor,
  MetadataProcessorBean,
} from "@compositor/core";
import { HttpMethod } from "@compositor/http";
import { Server } from "../decorator";
import { ServerBean } from "../server";

@Bean()
export class HandlerRegistrationAspect {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
    @Server() private server: ServerBean,
  ) {
    metadataProcessor.addHandler(
      APP_METADATA_KEY.APPLICATION_CONTROLLER,
      this.registerHandlers.bind(this),
    );
  }

  private registerHandlers(def: AnyBeanDefinition, wrapper: AnyBeanWrapper) {
    const handlerKeys: (string | symbol)[] = Reflect.getOwnMetadata(
      APP_METADATA_KEY.CONTROLLER_HANDLERS,
      def.getClass(),
    );
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
        path: Reflect.getOwnMetadata(
          APP_METADATA_KEY.CONTROLLER_HANDLER,
          def.getClass(),
          key,
        ) as unknown[],
      }))
      .map(({ handler, path }) => ({
        handler,
        method: path[0] as HttpMethod,
        path: path.slice(1).join("/"),
      }));

    for (const { handler, method, path } of handlers)
      this.server.registerRoute(method, path, handler);
  }
}
