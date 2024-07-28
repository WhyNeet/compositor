import { AnyBeanDefinition, AnyBeanWrapper, BeanWrapper, Scope } from "../bean";
import { InjectionToken } from "../injection-token";

export class SingletonBeanRegistry {
  private _registry: Map<InjectionToken, AnyBeanWrapper>;
  private _definitions: Map<InjectionToken, AnyBeanDefinition>;

  constructor() {
    this._registry = new Map();
  }

  public instantiate(definitions: Map<InjectionToken, AnyBeanDefinition>) {
    this._definitions = definitions;

    this.resolveDependencies();

    this.instantiateBeans();
  }

  private resolveDependencies() {
    // provide dependencies' definitions
    // circular dependencies must be resolved during instantiation

    for (const [_, definition] of this._definitions) {
      const dependencies = definition
        .getDependencies()
        .map((dependency) => this._definitions.get(dependency));
      definition.setResolvedDependencies(dependencies);
    }
  }

  private instantiateBeans() {
    for (const [token, definition] of this._definitions) {
      if (definition.getScope() !== Scope.Singleton) continue;
      this.instantiateSingleton(definition);
    }
  }

  private instantiateSingleton(definition: AnyBeanDefinition): AnyBeanWrapper {
    // if a bean's dependency is in prototype scope
    // TODO: create a separate registry for prototype beans
    // and an abstract bean registry class
    if (definition.getScope() === Scope.Prototype) {
      const beans =
        definition.getBeans() ??
        definition
          .getResolvedDependencies()
          .map((d) => this.instantiateSingleton(d));

      definition.setBeans(beans);

      return new BeanWrapper(this._definitions.get(definition.getToken()));
    }
    // if bean is already present in the registry
    if (this._registry.has(definition.getToken()))
      return this._registry.get(definition.getToken());

    const dependencies = definition.getResolvedDependencies();
    const beans = dependencies.map((dependency) =>
      this.instantiateSingleton(dependency),
    );

    definition.setBeans(beans);

    const bean = new BeanWrapper(definition);
    this._registry.set(definition.getToken(), bean);

    return bean;
  }
}
