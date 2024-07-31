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

  private resolveDefinitionDependencies(
    token: InjectionToken,
    stack = new Set<InjectionToken>(),
  ) {
    if (stack.has(token))
      throw new Error(`Circular dependency detected in: "${String(token)}"`);
    const definition = this._registry.get(token);

    if (definition.getResolvedBeanDefinitions() !== undefined)
      return definition;

    stack.add(token);

    const dependencies = definition
      .getDependencies()
      .map((dependency) =>
        this.resolveDefinitionDependencies(dependency, stack),
      );
    definition.setResolvedBeanDefinitions(dependencies);

    return definition;
  }

  public getAllMapped() {
    // create a clone of a map
    return new Map(this._registry);
  }
}
