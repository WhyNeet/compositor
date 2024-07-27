import { InjectionToken } from "../injection-token";
import { AnyBeanDefinition, BeanDefinition } from "./bean-definition";

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

  public getAllMapped() {
    // create a clone of a map
    return new Map(this._registry);
  }
}
