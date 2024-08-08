import {
  ApplicationContext,
  Bean,
  ContainerEvent,
  Context,
  EventListener,
} from "@compositor/core";
import { HttpMethod } from "@compositor/http";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

@Bean()
export class ServerBean {
  private _app: Express;

  constructor(@Context() private context: ApplicationContext) {
    this._app = express();

    this.context.containerEvents().subscribe(
      ContainerEvent.CONTAINER_BOOTSTRAPPED,
      (
        ((data) => {
          this.launch(8080, "127.0.0.1", () => {
            console.log("LAUNCHED EXPRESS SERVER", data);
          });
        }) as EventListener
      ).bind(this),
    );
  }

  public registerMiddleware(
    middleware: (
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ) => void,
    path?: string,
  ) {
    path ? this._app.use(path, middleware) : this._app.use(middleware);
  }

  public registerRoute(
    method: HttpMethod,
    path: string,
    handler: (req: ExpressRequest, res: ExpressResponse) => void,
  ) {
    this._app[method.toLowerCase()](path, handler);
  }

  public launch(port: number, hostname: string, callback?: () => void) {
    this._app.listen(port, hostname, callback);
  }
}
