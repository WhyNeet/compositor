import { Bean, HandlerPath } from "@compositor/core";
import { GenericHttpRequest, HttpHandler, HttpMapper } from "../../abstracts";
import { RequestMapper, ResponseMapper } from "../../decorators";
import { DefaultHttpRequest, DefaultHttpResponse } from "../../impl";
import { HttpMethod } from "../../types";
import { RouteResolverHolder } from "./resolvers";
import { RouteOptimizer } from "./route-optimizer";
import { RouteTransformer } from "./route-transformer";

export type AdditionalRequestMapper = (
  req: DefaultHttpRequest,
  res: DefaultHttpResponse,
) => void;

@Bean()
export class Router {
  private _additionalMappers: AdditionalRequestMapper[];

  constructor(
    private resolverHolder: RouteResolverHolder,
    private routeTransformer: RouteTransformer,
    private routeOptimizer: RouteOptimizer,
    @RequestMapper()
    private requestMapper: HttpMapper<unknown, DefaultHttpRequest>,
    @ResponseMapper()
    private responseMapper: HttpMapper<unknown, DefaultHttpResponse>,
  ) {
    this._additionalMappers = [];
  }

  public registerAdditionalMapper(mapper: AdditionalRequestMapper) {
    this._additionalMappers.push(mapper);
  }

  public registerHandler(path: HandlerPath, handler: HttpHandler) {
    const preparedPath = this.routeTransformer.transform(path);
    const optimizedPath = this.routeOptimizer.optimize(preparedPath);
    this.resolverHolder.resolver().addRoute(optimizedPath, handler);
  }

  public async handler(request: GenericHttpRequest, response: unknown) {
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

    const mappedRequest = this.requestMapper.map(request);
    const mappedResponse = this.responseMapper.map(response);

    for (const mapper of this._additionalMappers)
      mapper(mappedRequest, mappedResponse);

    await func(mappedRequest, mappedResponse);

    this.responseMapper.mapback(mappedResponse);
  }
}
