import { AnyBeanDefinition, AnyBeanWrapper, BeanWrapper } from "../bean";
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
      definition.setDependencyResolver(this.instantiateBean.bind(this));
      const bean = new BeanWrapper(definition);
      this._registry.set(definition.getToken(), bean);
      return bean;
    }

    if (this._registry.has(definition.getToken()))
      return this._registry.get(definition.getToken());

    const dependencies = definition.getResolvedBeanDefinitions();
    const beans = dependencies.map((def) => this.instantiateBean(def));

    definition.setResolvedBeans(beans);

    const bean = new BeanWrapper(definition);
    this._registry.set(definition.getToken(), bean);

    return bean;
  }
}
