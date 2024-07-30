import { AnyBeanDefinition } from "../bean";
import { InjectionToken } from "../injection-token";

export class BeanDefinitionRegistry {
  private _registry: Map<InjectionToken, AnyBeanDefinition>;

  constructor() {
    this._registry = new Map();
  }

  public put(definition: AnyBeanDefinition) {
    this._registry.set(definition.getToken(), definition);
  }

  public get(token: InjectionToken) {
    return this._registry.get(token);
  }

  public getAll() {
    return this._registry.values();
  }

  public resolveDependencies() {
    for (const [token, _] of this._registry) {
      this.resolveDefinitionDependencies(token);
    }
  }

  private resolveDefinitionDependencies(token: InjectionToken) {
    const definition = this._registry.get(token);

    if (definition.getResolvedDependencies() !== undefined) return definition;

    const dependencies = definition
      .getDependencies()
      .map((dependency) => this.resolveDefinitionDependencies(dependency));
    definition.setResolvedDependencies(dependencies);

    return definition;
  }

  public getAllMapped() {
    // create a clone of a map
    return new Map(this._registry);
  }
}
