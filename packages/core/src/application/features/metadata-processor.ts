import {
  AnyBeanDefinition,
  AnyBeanWrapper,
  Bean,
  ContainerEvent,
  EventData,
} from "../../ioc";
import { ApplicationContext } from "../context";
import { AdviceIgnore, Context } from "../decorator";

export type MetadataKey = string | symbol;
export type MetadataHandler = (
  definition: AnyBeanDefinition,
  wrapper: AnyBeanWrapper,
) => void;

@Bean()
@AdviceIgnore()
export class MetadataProcessorBean {
  private _handlers: Map<MetadataKey, MetadataHandler[]>;
  private _events: EventData[];

  constructor(@Context() context: ApplicationContext) {
    this._events = [];
    this._handlers = new Map();

    context
      .containerEvents()
      .subscribe(ContainerEvent.CONTAINER_BOOTSTRAPPED, () => {
        context.containerEvents().subscribe(
          ContainerEvent.BEAN_INSTANTIATED,
          (data) => {
            this._events.push(data);
            this.emit(data);
          },
          true,
        );
      });
  }

  private emit(data: EventData, customKey?: MetadataKey) {
    const keys: MetadataKey[] = Reflect.getOwnMetadataKeys(
      data.payload.bean.getInstance().constructor,
    );

    if (customKey) {
      if (this._handlers.has(customKey) && keys.includes(customKey))
        for (const handler of this._handlers.get(customKey))
          handler(data.payload.definition, data.payload.bean);
      return;
    }
    for (const key of keys)
      if (this._handlers.has(key))
        for (const handler of this._handlers.get(key))
          handler(data.payload.definition, data.payload.bean);
  }

  public addHandler(key: MetadataKey, handler: MetadataHandler, replay = true) {
    if (this._handlers.has(key)) this._handlers.get(key).push(handler);
    else this._handlers.set(key, [handler]);

    if (replay)
      for (const data of this._events) {
        const keys: MetadataKey[] = Reflect.getOwnMetadataKeys(
          data.payload.bean.getInstance().constructor,
        );

        if (this._handlers.has(key) && keys.includes(key))
          handler(data.payload.definition, data.payload.bean);
      }
  }
}
