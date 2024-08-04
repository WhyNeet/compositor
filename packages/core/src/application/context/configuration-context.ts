import { Ctor, InjectionToken } from "../../ioc";
import { Configuration } from "../configuration";
import { ApplicationContext } from "./context";

export class ConfigurationContext {
  private _context: ApplicationContext;
  private _configure: (
    conf: { new (): Configuration },
    context: ConfigurationContext,
  ) => void;

  constructor(
    context: ApplicationContext,
    configure: (
      conf: { new (): Configuration },
      context: ConfigurationContext,
    ) => void,
  ) {
    this._context = context;
    this._configure = configure;
  }

  public configure(configuration: { new (): Configuration }) {
    this._configure(configuration, this);
  }

  public registerFactory(token: InjectionToken, factory: () => unknown) {
    this._context.registerFactory(token, factory);
  }

  public registerCtor(token: InjectionToken, ctor: Ctor): void;
  public registerCtor(ctor: Ctor): void;

  public registerCtor(tokenOrCtor: InjectionToken | Ctor, ctor?: Ctor): void {
    this._context.registerCtor(tokenOrCtor as InjectionToken, ctor);
  }
}
