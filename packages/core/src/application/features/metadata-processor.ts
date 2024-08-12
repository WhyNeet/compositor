import {
  AnyBeanDefinition,
  AnyBeanWrapper,
  Bean,
  ContainerEvent,
} from "../../ioc";
import { ApplicationContext } from "../context";
import { Context } from "../decorator";

export type MetadataKey = string | symbol;
export type MetadataHandler = (
  definition: AnyBeanDefinition,
  wrapper: AnyBeanWrapper,
) => void;

@Bean()
export class MetadataProcessorBean {
  private _handlers: Map<MetadataKey, MetadataHandler[]>;

  constructor(@Context() context: ApplicationContext) {
    this._handlers = new Map();

    context
      .containerEvents()
      .subscribe(ContainerEvent.CONTAINER_BOOTSTRAPPED, () => {
        context.containerEvents().subscribe(
          ContainerEvent.BEAN_INSTANTIATED,
          (data) => {
            const keys: MetadataKey[] = Reflect.getOwnMetadataKeys(
              data.payload.bean.getInstance().constructor,
            );
            for (const key of keys)
              if (this._handlers.has(key))
                for (const handler of this._handlers.get(key))
                  handler(data.payload.definition, data.payload.bean);
          },
          true,
        );
      });
  }

  public addHandler(key: MetadataKey, handler: MetadataHandler) {
    if (this._handlers.has(key)) this._handlers.get(key).push(handler);
    else this._handlers.set(key, [handler]);
  }
}
