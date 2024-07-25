import { METADATA_KEY } from "../constants";
import { NoBeanAnnotationError } from "../error/no-bean-annotation";
import { InjectionToken } from "../injection-token";
import { Ctor } from "../types";
import { Scope } from "./bean-scope";

export class BeanDefinition {
  private _token: InjectionToken;
  private _class: Ctor;
  private _dependencies: InjectionToken[];
  private _lazy: boolean;
  private _scope: Scope;

  constructor(token: InjectionToken, ctor: Ctor) {
    this._token = token;
    this._class = ctor;

    this.readMetadata();
  }

  private readMetadata() {
    // const injectable: boolean = Reflect.getOwnMetadata(METADATA_KEY.IOC_INJECTABLE, this._class);
    // if (typeof injectable !== 'boolean') throw new NoBeanAnnotationError(this._class);

    const dependencies: InjectionToken[] = Reflect.getOwnMetadata(
      METADATA_KEY.IOC_DEPENDENCIES,
      this._class,
    );
    this._dependencies = dependencies;

    const lazy: boolean =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_LAZY, this._class) ?? false;
    this._lazy = lazy;

    const scope: Scope =
      Reflect.getOwnMetadata(METADATA_KEY.IOC_SCOPE, this._class) ??
      Scope.Singleton;
    this._scope = scope;
  }

  public getToken() {
    return this._token;
  }
}
