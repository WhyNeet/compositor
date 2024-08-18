import { Bean, HandlerPath } from "@compositor/core";

@Bean()
export class RouteTransformer {
  public transform(route: HandlerPath) {
    const result = [];

    for (const segment of route) {
      if (typeof segment === "string") result.push(...segment.split("/"));
      else result.push(segment);
    }

    return result;
  }
}
