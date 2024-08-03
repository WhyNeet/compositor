import { Container, Ctor } from "../ioc";
import { Configuration } from "./configuration";
import { ApplicationContext, ConfigurationContext } from "./context";

export class Application {
  private _context: ApplicationContext;

  constructor() {
    const container = new Container();
    const context = new ApplicationContext(container);
    this._context = context;
  }

  public configure(configuration: Configuration) {
    const context = new ConfigurationContext(this._context, this._configure);
    configuration.configure(context);
  }

  private _configure(cfg: Configuration, cx: ConfigurationContext) {
    cfg.configure(cx);
  }

  public getContext() {
    return this._context;
  }

  public bootstrap() {
    this._context.bootstrap();
  }
}
