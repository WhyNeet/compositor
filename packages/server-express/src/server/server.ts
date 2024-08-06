import { Bean } from "@compositor/core";
import { HttpMethod } from "@compositor/http";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

@Bean()
export class Server {
  private _app: Express;

  constructor() {
    this._app = express();
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
