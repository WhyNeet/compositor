import { getCtorToken } from "../application/util";
import { BeanDefinition } from "./bean/bean-definition";
import { ContainerEvent, ContainerEvents, constructEventData } from "./events";
import { EventSubscriber } from "./events/event-subscriber";
import { InjectionToken } from "./injection-token";
import { BeanDefinitionRegistry, BeanInstanceRegistry } from "./registry";
import { Ctor } from "./types";

export class Container {
  private _beanDefinitionRegistry: BeanDefinitionRegistry;
  private _beanInstanceRegistry: BeanInstanceRegistry;
  private _events: ContainerEvents;
  private _isBootstrapped = false;

  constructor() {
    this._beanDefinitionRegistry = new BeanDefinitionRegistry();
    this._events = new ContainerEvents();
    this._beanInstanceRegistry = new BeanInstanceRegistry(this._events);
  }

  public register<T extends Ctor>(entity: RegistrationEntity<T>) {
    if (this.isFactoryEntity(entity))
      this.registerFactory(entity.token, entity.factory);
    else if (entity.token) this.registerCtor(entity.token, entity.bean);
    else this.registerCtor(getCtorToken(entity.bean), entity.bean);

    if (this._isBootstrapped) this.wire();

    return this;
  }

  private isFactoryEntity<T extends Ctor>(
    entity: RegistrationEntity<T>,
  ): entity is { factory: () => unknown; token: InjectionToken } {
    return (entity as { factory: unknown }).factory !== undefined;
  }

  private registerCtor(token: InjectionToken, ctor: Ctor) {
    const definition = BeanDefinition.class(token, ctor);
    this._events.emit(
      constructEventData(ContainerEvent.BEAN_DEFINED, definition),
    );
    this._beanDefinitionRegistry.put(definition);
  }

  private registerFactory(token: InjectionToken, factory: () => unknown) {
    const definition = BeanDefinition.factory(token, factory);
    this._events.emit(
      constructEventData(ContainerEvent.BEAN_DEFINED, definition),
    );
    this._beanDefinitionRegistry.put(definition);
  }

  public events() {
    return new EventSubscriber(this._events);
  }

  public getBean<T>(token: InjectionToken): T | null {
    return this._beanInstanceRegistry.getBean(token).getInstance();
  }

  public wire() {
    const defs = this._beanDefinitionRegistry.resolveDependencies();

    this._beanInstanceRegistry.instantiate(
      this._beanDefinitionRegistry.getAllMapped(),
      defs.map((def) => def.getToken()),
    );
  }

  public bootstrap() {
    this.wire();

    this._events.emit(
      constructEventData(ContainerEvent.CONTAINER_BOOTSTRAPPED),
    );
    this._isBootstrapped = true;
  }
}
export type RegistrationEntity<T extends Ctor> =
  | { factory: () => unknown; token: InjectionToken }
  | { token?: InjectionToken; bean: T };
