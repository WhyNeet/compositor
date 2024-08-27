import { Container } from "../ioc";
import { Configuration } from "./configuration";
import { ApplicationContext, ConfigurationContext } from "./context";
import { ApplicationEvents } from "./features/events/application-events";

export class Application {
  private _context: ApplicationContext;
  private _events: ApplicationEvents;

  constructor() {
    const container = new Container();
    const context = new ApplicationContext(container, this);
    this._events = new ApplicationEvents();
    this._context = context;
  }

  public configure(configuration: { new (): Configuration }) {
    const context = new ConfigurationContext(this._context, this._configure);
    const conf = new configuration();
    conf.configure(context);
  }

  public events() {
    return this._events;
  }

  private _configure(cfg: { new (): Configuration }, cx: ConfigurationContext) {
    const configuration = new cfg();
    configuration.configure(cx);
  }

  public getContext() {
    return this._context;
  }

  public bootstrap() {
    this._context.bootstrap();
  }
}
