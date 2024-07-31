import { METADATA_KEY } from "../constants";
import { InjectionToken } from "../injection-token";
import { Ctor, FieldArg } from "../types";
import { BeanScope } from "./bean-scope";
import { AnyBeanWrapper } from "./bean-wrapper";

export class BeanDefinition<T extends Ctor> {
  private _token: InjectionToken;
  private _class: T | null;
  private _factory: () => InstanceType<T>;

  /**
   * These are dependencies' injection tokens (retrieved from class metadata)
   * @see the \@Bean decorator
   */
  private _dependencies: InjectionToken[];

  /**
   * These are dependencies' definitions (retrieved in BeanDefinitionRegistry)
   * @see BeanDefinitionRegistry class
   */
  private _resolvedBeanDefinitions: AnyBeanDefinition[];

  /**
   * These are dependencies' beams (retrieved in BeanInstanceRegistry)
   * @see BeanInstanceRegistry class
   */
  private _resolvedBeans: Map<InjectionToken, AnyBeanWrapper>;
  private _lazy: boolean;
  private _scope: BeanScope;
  private _fieldDependencies: FieldArg[];
  private _constructorArgs: InjectionToken[];

  public static class<T extends Ctor>(token: InjectionToken, ctor: T) {
    const definition = new BeanDefinition<T>();

    definition._token = token;
    definition._class = ctor;
    definition._resolvedBeans = new Map();

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
    definition._resolvedBeans = new Map();

    return definition;
  }

  private readMetadata(obj: unknown) {
    const fieldDependencies: FieldArg[] =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_FIELD_ARGS, obj) ?? [];
    this._fieldDependencies = fieldDependencies;

    const constructorDependencies: InjectionToken[] = Reflect.getOwnMetadata(
      METADATA_KEY.IOC_FACTORY_ARGS,
      obj,
    );

    const constructorDependenciesMapping: InjectionToken[] =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_FACTORY_PARAM_MAP, obj) ?? [];

    for (let i = 0; i < constructorDependenciesMapping.length; i++) {
      if (constructorDependenciesMapping[i])
        constructorDependencies[i] = constructorDependenciesMapping[i];
    }

    this._constructorArgs = constructorDependencies;

    this._dependencies = [
      ...fieldDependencies.map((arg) => arg.token),
      ...constructorDependencies,
    ];

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

  public setResolvedBeanDefinitions(definitions: AnyBeanDefinition[]) {
    this._resolvedBeanDefinitions = definitions;
  }

  public getResolvedBeanDefinitions() {
    return this._resolvedBeanDefinitions;
  }

  public setResolvedBeans(beans: AnyBeanWrapper[]) {
    this._resolvedBeans.clear();
    for (const bean of beans) this._resolvedBeans.set(bean.getToken(), bean);
  }

  public getBeans() {
    return this._resolvedBeans;
  }

  public getFieldDependencies() {
    return this._fieldDependencies;
  }

  public getConstructorArgs() {
    return this._constructorArgs;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: suppress ts error
export type AnyBeanDefinition = BeanDefinition<any>;
