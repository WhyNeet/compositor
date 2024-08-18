import { Bean, HandlerPath } from "@compositor/core";
import { GenericHttpRequest, HttpHandler } from "../../abstracts";
import { HttpMethod } from "../../types";
import { RouteResolverHolder } from "./resolvers";
import { RouteOptimizer } from "./route-optimizer";
import { RouteTransformer } from "./route-transformer";

@Bean()
export class Router {
  constructor(
    private resolverHolder: RouteResolverHolder,
    private routeTransformer: RouteTransformer,
    private routeOptimizer: RouteOptimizer,
  ) {}

  public registerHandler(path: HandlerPath, handler: HttpHandler) {
    const preparedPath = this.routeTransformer.transform(path);
    const optimizedPath = this.routeOptimizer.optimize(preparedPath);
    this.resolverHolder.resolver().addRoute(optimizedPath, handler);
  }

  public handler(request: GenericHttpRequest, response: unknown) {
    const handler = this.resolverHolder.resolver().resolve(
      request.path.split("/").filter((segment) => segment.length),
      {
        method: request.method.toUpperCase() as HttpMethod,
      },
    );
    if (!handler)
      throw new Error(
        `Path "${request.method.toUpperCase()} ${request.path}" not found.`,
      );
    const [func, metadata] = handler;
    if (metadata) {
      (request as unknown as Record<string, unknown>)["params"] =
        metadata.params;
      (request as unknown as Record<string, unknown>)["paths"] = metadata.paths;
    }

    func(request, response);
  }
}
