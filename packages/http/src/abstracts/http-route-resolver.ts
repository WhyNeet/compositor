import { HandlerPath, RawHandlerPath } from "@compositor/core";
import { HttpMethod } from "../types";
import { HttpHandler } from "./http-handler";

export abstract class HttpRouteResolver {
  abstract resolve(
    path: RawHandlerPath,
    metadata: PathResolverMetadata,
  ): [HttpHandler, PathResolverOutputMetadata];
  abstract addRoute(
    path: HandlerPath,
    handler: HttpHandler,
    metadata: PathResolverMetadata,
  ): void;
}

export interface PathResolverMetadata {
  method: HttpMethod;
}

export interface PathResolverOutputMetadata {
  // a map of route param names and their values
  params: Map<string, string>;
  // a map of raw route strings in place of wildcards
  paths: Map<string, string>;
}
