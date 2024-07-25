import { InjectionToken } from "../injection-token";
import { BeanDefinition } from "./bean-definition";

export class BeanDefinitionRegistry {
  private _registry: Map<InjectionToken, BeanDefinition>;

  constructor() {
    this._registry = new Map();
  }

  public put(definition: BeanDefinition) {
    this._registry.set(definition.getToken(), definition);
  }

  public get(token: InjectionToken) {
    return this._registry.get(token);
  }

  public getAll() {
    return this._registry.values();
  }
}
