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
    return this;
  }

  public register<Bean extends Ctor>(entity: RegistrationEntity<Bean>) {
    if (this.isFactoryEntity(entity))
      this._context.registerFactory(entity.token, entity.factory);
    else if (entity.token)
      this._context.registerCtor(entity.token, entity.bean);
    else this._context.registerCtor(entity.bean);

    return this;
  }

  private isFactoryEntity<Bean extends Ctor>(
    entity: RegistrationEntity<Bean>,
  ): entity is { factory: () => unknown; token: InjectionToken } {
    return (entity as { factory: unknown }).factory !== undefined;
  }
}

export type RegistrationEntity<Bean extends Ctor> =
  | { factory: () => unknown; token: InjectionToken }
  | { token?: InjectionToken; bean: Bean };
