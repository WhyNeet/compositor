import { Bean, HandlerPath } from "@compositor/core";
import { GenericHttpRequest, HttpHandler } from "../../abstracts";
import { HttpMethod } from "../../types";
import { RouteResolverHolder } from "./resolvers";

@Bean()
export class Router {
  constructor(private resolverHolder: RouteResolverHolder) {}

  public registerHandler(
    method: HttpMethod,
    path: HandlerPath,
    handler: HttpHandler,
  ) {
    this.resolverHolder.resolver().addRoute(path, handler, { method });
  }

  public handler(request: GenericHttpRequest, response: unknown) {
    const handler = this.resolverHolder
      .resolver()
      .resolve(request.path.split("/"), {
        method: request.method.toUpperCase() as HttpMethod,
      });
    if (!handler) console.log("No handler found for path:", request.path);
    const [func, metadata] = handler;
    (request as unknown as Record<string, unknown>)["params"] = metadata.params;
    (request as unknown as Record<string, unknown>)["paths"] = metadata.paths;

    func(request, response);
  }
}
