import { InjectionToken } from "../injection-token";
import { AnyBean, Bean } from "./bean";
import { AnyBeanDefinition, BeanDefinition } from "./bean-definition";

export class SingletonBeanRegistry {
  private _registry: Map<InjectionToken, AnyBean>;

  constructor() {
    this._registry = new Map();
  }

  public register(definitions: AnyBeanDefinition[]) {
    for (const definition of definitions) this.registerSingleton(definition);
  }

  private registerSingleton(definition: AnyBeanDefinition) {
    const bean = new Bean(definition);
    this._registry.set(definition.getToken(), bean);
  }
}
