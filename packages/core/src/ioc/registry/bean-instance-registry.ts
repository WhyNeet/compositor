import {
  AnyBeanDefinition,
  AnyBeanWrapper,
  BeanScope,
  BeanWrapper,
} from "../bean";
import { InjectionToken } from "../injection-token";

export class BeanInstanceRegistry {
  private _registry: Map<InjectionToken, AnyBeanWrapper>;
  private _definitions: Map<InjectionToken, AnyBeanDefinition>;

  constructor() {
    this._registry = new Map();
  }

  public instantiate(definitions: Map<InjectionToken, AnyBeanDefinition>) {
    this._definitions = definitions;

    this.instantiateBeans();
  }

  private instantiateBeans() {
    for (const [token, definition] of this._definitions) {
      if (definition.getScope() !== BeanScope.Singleton) continue;
      this.instantiateSingleton(definition);
    }
  }

  private instantiateSingleton(definition: AnyBeanDefinition): AnyBeanWrapper {
    // if a bean's dependency is in prototype scope
    // TODO: create a separate registry for prototype beans
    // and an abstract bean registry class
    if (definition.getScope() === BeanScope.Prototype) {
      const beans =
        definition.getBeans() ??
        definition
          .getResolvedBeanDefinitions()
          .map((def) => this.instantiateSingleton(def));

      definition.setResolvedBeans(beans);

      return new BeanWrapper(this._definitions.get(definition.getToken()));
    }
    // if bean is already present in the registry
    if (this._registry.has(definition.getToken()))
      return this._registry.get(definition.getToken());

    const dependencies = definition.getResolvedBeanDefinitions();
    const beans = dependencies.map((def) => this.instantiateSingleton(def));

    definition.setResolvedBeans(beans);

    const bean = new BeanWrapper(definition);
    this._registry.set(definition.getToken(), bean);

    return bean;
  }
}
