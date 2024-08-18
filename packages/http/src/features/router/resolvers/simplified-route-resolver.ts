import {
  HandlerPath,
  HandlerPathEntity,
  RawHandlerPath,
} from "@compositor/core";
import {
  GenericHttpRequest,
  HttpHandler,
  HttpRouteResolver,
  PathResolverMetadata,
  PathResolverOutputMetadata,
} from "../../../abstracts";
import { HttpMethod } from "../../../types";

export class SimplifiedRouteResolver implements HttpRouteResolver {
  private _mapping: Map<
    string,
    [
      HttpMethod,
      <Request extends GenericHttpRequest>(
        request: Request,
        response: unknown,
      ) => void,
    ][]
  >;

  constructor() {
    this._mapping = new Map();
  }

  resolve(
    path: RawHandlerPath,
    metadata: PathResolverMetadata,
  ): [HttpHandler, PathResolverOutputMetadata] {
    const joined = path.join("/");

    const [_, handler] = this._mapping
      .get(joined)
      .find(([method]) => method === metadata.method.toUpperCase());
    return [handler, null];
  }

  addRoute(path: HandlerPath, handler: HttpHandler): void {
    // method token will always be first because all routes are optimized
    const method = (path[0] as HandlerPathEntity).data as HttpMethod;
    const joined = path.slice(1).join("/");
    if (this._mapping.has(joined))
      this._mapping.set(joined, [
        ...this._mapping.get(joined),
        [method, handler],
      ]);
    else this._mapping.set(joined, [[method, handler]]);
  }
}
