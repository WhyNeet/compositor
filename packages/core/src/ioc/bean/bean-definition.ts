import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";
import { Ctor } from "../types";
import { BeanScope } from "./bean-scope";
import { AnyBeanWrapper } from "./bean-wrapper";

export class BeanDefinition<T extends Ctor> {
  private _token: InjectionToken;
  private _class: T | null;
  private _factory: () => InstanceType<T>;
  private _dependencies: InjectionToken[];
  private _resolvedDependencies: AnyBeanDefinition[];
  private _beans: AnyBeanWrapper[];
  private _lazy: boolean;
  private _scope: BeanScope;

  public static class<T extends Ctor>(token: InjectionToken, ctor: T) {
    const definition = new BeanDefinition<T>();

    definition._token = token;
    definition._class = ctor;

    definition.readMetadata(definition._class);

    return definition;
  }

  public static factory<T extends Ctor>(
    token: InjectionToken,
    factory: () => InstanceType<T>,
  ) {
    const definition = new BeanDefinition<T>();

    definition._token = token;
    definition._factory = factory;

    return definition;
  }

  private readMetadata(obj: unknown) {
    const dependencies: InjectionToken[] =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_DEPENDENCIES, obj) ?? [];

    const constructorDependencies: InjectionToken[] = Reflect.getOwnMetadata(
      METADATA_KEY.IOC_FACTORY_ARGS,
      obj,
    );

    this._dependencies = [...dependencies, ...constructorDependencies];

    const lazy: boolean =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_LAZY, obj) ?? false;
    this._lazy = lazy;

    const scope: BeanScope =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_SCOPE, obj) ??
      BeanScope.Singleton;
    this._scope = scope;
  }

  public getToken() {
    return this._token;
  }

  public isLazy() {
    return this._lazy;
  }

  public getFactory() {
    return this._factory;
  }

  public getFactoryResult() {
    const result = this._factory();

    // read metadata of class instance
    this.readMetadata(result);

    return result;
  }

  public getClass() {
    return this._class;
  }

  public getScope() {
    return this._scope;
  }

  public getDependencies() {
    return this._dependencies ?? [];
  }

  public setResolvedDependencies(beans: AnyBeanDefinition[]) {
    this._resolvedDependencies = beans;
  }

  public getResolvedDependencies() {
    return this._resolvedDependencies;
  }

  public setBeans(beans: AnyBeanWrapper[]) {
    this._beans = beans;
  }

  public getBeans() {
    return this._beans;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: suppress ts error
export type AnyBeanDefinition = BeanDefinition<any>;
