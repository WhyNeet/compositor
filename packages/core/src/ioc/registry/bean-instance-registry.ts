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
      this.instantiateBean(definition);
    }
  }

  private instantiateBean(definition: AnyBeanDefinition): AnyBeanWrapper {
    if (definition.isLazy() && !this._registry.has(definition.getToken())) {
      definition.setDependencyResolver((def) => this.instantiateBean(def));
      const bean = new BeanWrapper(definition);
      this._registry.set(definition.getToken(), bean);
      return bean;
    }

    if (this._registry.has(definition.getToken()))
      return this._registry.get(definition.getToken());

    const bean = new BeanWrapper(definition, true);
    this._registry.set(definition.getToken(), bean);
    const dependencies = definition.getResolvedBeanDefinitions();
    const beans = dependencies.map((def) => this.instantiateBean(def));

    definition.setResolvedBeans(beans);

    if (definition.getScope() !== BeanScope.Prototype) bean.instantiate();

    return bean;
  }
}
