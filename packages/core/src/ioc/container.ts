import { BeanDefinition } from "./bean/bean-definition";
import { ContainerEvents } from "./events";
import { EventSubscriber } from "./events/event-subscriber";
import { InjectionToken } from "./injection-token";
import { BeanDefinitionRegistry, BeanInstanceRegistry } from "./registry";
import { Ctor } from "./types";

export class Container {
  private _beanDefinitionRegistry: BeanDefinitionRegistry;
  private _singletonBeanRegistry: BeanInstanceRegistry;
  private _events: ContainerEvents;

  constructor() {
    this._beanDefinitionRegistry = new BeanDefinitionRegistry();
    this._events = new ContainerEvents();
  }

  public registerCtor(token: InjectionToken, ctor: Ctor) {
    const definition = BeanDefinition.class(token, ctor);
    this._beanDefinitionRegistry.put(definition);
  }

  public registerFactory(token: InjectionToken, factory: () => unknown) {
    const definition = BeanDefinition.factory(token, factory);
    this._beanDefinitionRegistry.put(definition);
  }

  public events() {
    return new EventSubscriber(this._events);
  }

  public bootstrap() {
    this._beanDefinitionRegistry.resolveDependencies();

    this._singletonBeanRegistry = new BeanInstanceRegistry();
    this._singletonBeanRegistry.instantiate(
      this._beanDefinitionRegistry.getAllMapped(),
    );
  }
}
