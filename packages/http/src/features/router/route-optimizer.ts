import { Bean, HandlerPath, HandlerPathEntity } from "@compositor/core";
import { HttpMethod } from "../../types";
import { PathToken } from "../handler";

@Bean()
export class RouteOptimizer {
  public optimize(path: HandlerPath) {
    const result = [null];
    let firstMethod = null;

    let idx = 0;

    while (idx < path.length) {
      const segment = path[idx];

      if (typeof segment === "string" && segment.length !== 0)
        result.push(segment);
      else if (
        (segment as HandlerPathEntity).token === PathToken.Method &&
        !firstMethod
      )
        firstMethod = segment;
      else if (
        (segment as HandlerPathEntity).token === PathToken.Wildcard &&
        ((segment as HandlerPathEntity).data as { double: boolean }).double
      ) {
        result.push(segment);
        let nextIdx = idx + 1;
        while (
          nextIdx < path.length &&
          typeof path[nextIdx] !== "string" &&
          (path[nextIdx] as HandlerPathEntity).token === PathToken.Param
        )
          nextIdx += 1;
        idx = nextIdx - 1;
      }

      idx += 1;
    }

    result[0] = firstMethod ?? {
      token: PathToken.Method,
      data: HttpMethod.GET,
    };

    return result;
  }
}
