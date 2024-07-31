import { InjectionToken } from "../injection-token";
import { Ctor } from "../types";
import { BeanDefinition } from "./bean-definition";
import { BeanScope } from "./bean-scope";

export class BeanWrapper<T extends Ctor> {
  private _factory: () => InstanceType<T>;
  private _instance: InstanceType<T> | null = null;
  private _scope: BeanScope;
  private _lazy: boolean;
  private _token: InjectionToken;

  constructor(definition: BeanDefinition<T>, manualInstantiation = false) {
    this._scope = definition.getScope();
    this._lazy = definition.isLazy();
    this._token = definition.getToken();
    this._factory =
      definition.getFactory() ??
      (() => {
        if (definition.isLazy()) {
          const definitionResolver = definition.getDefinitionResolver();
          const definitions = definition
            .getDependencies()
            .map(definitionResolver);
          definition.setResolvedBeanDefinitions(definitions);

          const resolver = definition.getDependencyResolver();
          const beans = definition
            .getResolvedBeanDefinitions()
            .map((dep) => resolver(dep));
          definition.setResolvedBeans(beans);
        }

        // biome-ignore lint/suspicious/noExplicitAny: suppress ts error
        const beanInstance = Reflect.construct<any[], InstanceType<T>>(
          definition.getClass(),
          definition
            .getConstructorArgs()
            .map((token) => definition.getBeans().get(token).getInstance()),
        );

        for (const { instance, token, property } of definition
          .getFieldDependencies()
          .map(({ token, property }) => ({
            instance: definition.getBeans().get(token).getInstance(),
            token,
            property,
          }))) {
          beanInstance[property] = instance;
        }

        if (definition.getPostConstructMethodKey())
          beanInstance[definition.getPostConstructMethodKey()]();

        return beanInstance;
      });

    if (
      !this._lazy &&
      this._scope !== BeanScope.Prototype &&
      !manualInstantiation
    )
      this.instantiate();
  }

  public getInstance(): InstanceType<T> {
    if (this._scope === BeanScope.Prototype) return this._factory();
    if (this._lazy)
      return new Proxy(
        {},
        {
          get: (target, prop, recv) => {
            if (!this._instance) this.instantiate();
            // biome-ignore lint/complexity/noBannedTypes: must be an object
            return Reflect.get(this._instance as Object, prop, recv);
          },
        },
      ) as InstanceType<T>;
    // biome-ignore lint/style/noNonNullAssertion: cannot be null here
    return this._instance!;
  }

  public instantiate() {
    this._instance = this._factory();
  }

  public getToken() {
    return this._token;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: must use any
export type AnyBeanWrapper = BeanWrapper<any>;
