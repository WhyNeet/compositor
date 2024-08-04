import {
  AnyBeanDefinition,
  AnyBeanWrapper,
  BeanScope,
  BeanWrapper,
} from "../bean";
import { ContainerEvent, ContainerEvents, constructEventData } from "../events";
import { InjectionToken } from "../injection-token";

export class BeanInstanceRegistry {
  private _registry: Map<InjectionToken, AnyBeanWrapper>;
  private _definitions: Map<InjectionToken, AnyBeanDefinition>;
  private _events: ContainerEvents;

  constructor(events: ContainerEvents) {
    this._registry = new Map();
    this._events = events;
  }

  public instantiate(definitions: Map<InjectionToken, AnyBeanDefinition>) {
    this._definitions = definitions;

    this.instantiateBeans();
  }

  private instantiateBeans() {
    for (const [_, definition] of this._definitions) {
      this.instantiateBean(definition);
    }
  }

  private instantiateBean(definition: AnyBeanDefinition): AnyBeanWrapper {
    const onInstantiate = ((wrapper: AnyBeanWrapper) => {
      this._events.emit(
        constructEventData(
          ContainerEvent.BEAN_INSTANTIATED,
          definition,
          wrapper,
        ),
      );
    }).bind(this);

    if (definition.isLate() && !this._registry.has(definition.getToken())) {
      definition.setDependencyResolver((def) => this.instantiateBean(def));
      const bean = new BeanWrapper(definition, onInstantiate);
      this._registry.set(definition.getToken(), bean);
      return bean;
    }

    if (this._registry.has(definition.getToken()))
      return this._registry.get(definition.getToken());

    const bean = new BeanWrapper(definition, onInstantiate, true);
    this._registry.set(definition.getToken(), bean);
    const dependencies = definition.getResolvedBeanDefinitions();
    const beans = dependencies.map((def) => this.instantiateBean(def));

    definition.setResolvedBeans(beans);

    if (definition.getScope() !== BeanScope.Prototype) bean.instantiate();

    return bean;
  }
}
