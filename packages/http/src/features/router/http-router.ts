import { Bean } from "@compositor/core";
import { GenericHttpRequest, HttpHandler } from "../../abstracts";
import { HttpMethod } from "../../types";

@Bean()
export class Router {
  constructor(private resolver: RouteResolver) {}

  public registerHandler(
    method: HttpMethod,
    path: string,
    handler: HttpHandler,
  ) {
    // TODO
  }

  public handler(request: GenericHttpRequest, response: unknown) {
    // TODO
  }
}
