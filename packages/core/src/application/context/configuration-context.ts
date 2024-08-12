import { Ctor, InjectionToken, RegistrationEntity } from "../../ioc";
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
    this._context.register(entity);

    return this;
  }
}
