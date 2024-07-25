import { METADATA_KEY } from "../constants";
import { NoBeanAnnotationError } from "../error/no-bean-annotation";
import { InjectionToken } from "../injection-token";
import { Ctor } from "../types";
import { Scope } from "./bean-scope";

export class BeanDefinition {
  private _token: InjectionToken;
  private _class: Ctor | null;
  private _factory: () => unknown;
  private _dependencies: InjectionToken[];
  private _lazy: boolean;
  private _scope: Scope;

  public static class(token: InjectionToken, ctor: Ctor) {
    const definition = new BeanDefinition();

    definition._token = token;
    definition._class = ctor;

    definition.readMetadata(definition._class);

    return definition;
  }

  public static factory(token: InjectionToken, factory: () => unknown) {
    const definition = new BeanDefinition();

    definition._token = token;
    definition._factory = factory;

    return definition;
  }

  private readMetadata(obj: unknown) {
    const dependencies: InjectionToken[] = Reflect.getOwnMetadata(
      METADATA_KEY.IOC_DEPENDENCIES,
      obj,
    );
    this._dependencies = dependencies;

    const lazy: boolean =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_LAZY, obj) ?? false;
    this._lazy = lazy;

    const scope: Scope =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_SCOPE, obj) ?? Scope.Singleton;
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
}
