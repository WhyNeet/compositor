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
    this.registerCtor = context.registerCtor.bind(context);
    this.registerFactory = context.registerFactory.bind(context);
  }

  public configure(configuration: { new (): Configuration }) {
    this._configure(configuration, this);
  }

  public registerFactory: ApplicationContext["registerFactory"];
  public registerCtor: ApplicationContext["registerCtor"];
}
