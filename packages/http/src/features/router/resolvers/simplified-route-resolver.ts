import { HandlerPath, RawHandlerPath } from "@compositor/core";
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

  addRoute(
    path: HandlerPath,
    handler: HttpHandler,
    metadata: PathResolverMetadata,
  ): void {
    const joined = path.join("/");
    if (this._mapping.has(joined))
      this._mapping.set(joined, [
        ...this._mapping.get(joined),
        [metadata.method, handler],
      ]);
    else this._mapping.set(joined, [[metadata.method, handler]]);
  }
}
