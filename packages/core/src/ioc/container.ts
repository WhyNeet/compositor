import { BeanDefinition } from "./bean/bean-definition";
import { BeanDefinitionRegistry } from "./bean/bean-definition-registry";
import { InjectionToken } from "./injection-token";
import { Ctor } from "./types";

export class Container {
  private _beanDefinitionRegistry: BeanDefinitionRegistry;

  constructor() {
    this._beanDefinitionRegistry = new BeanDefinitionRegistry();
  }

  public registerCtor(token: InjectionToken, ctor: Ctor) {
    const definition = BeanDefinition.class(token, ctor);
    this._beanDefinitionRegistry.put(definition);
  }

  public registerFactory(token: InjectionToken, factory: () => unknown) {
    const definition = BeanDefinition.factory(token, factory);
    this._beanDefinitionRegistry.put(definition);
  }
}
