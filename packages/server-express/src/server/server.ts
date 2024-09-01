import { AdviceIgnore, Bean } from "@compositor/core";
import {
  GenericHttpRequest,
  HttpServer,
  HttpServerConfiguration,
} from "@compositor/http";
import express, { Express } from "express";

@Bean()
@AdviceIgnore()
export class ServerBean implements HttpServer {
  private _app: Express;
  private _conf: HttpServerConfiguration;

  constructor() {
    this._app = express();
  }

  configure(configuration: HttpServerConfiguration): void {
    this._conf = configuration;

    this.setupMiddleware();
  }

  private setupMiddleware() {
    for (const mw of this._conf.middlewares) this._app.use(mw);
  }

  mount(
    handler: (request: GenericHttpRequest, response: unknown) => void,
  ): void {
    this._app.all("/*", handler);
  }

  public launch() {
    this._app.listen(
      this._conf.port,
      this._conf.hostname,
      this._conf.launchCallback,
    );
  }
}
