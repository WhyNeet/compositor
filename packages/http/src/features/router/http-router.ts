import { Bean } from "@compositor/core";
import { GenericHttpRequest } from "../../abstracts";
import { HttpMethod } from "../../types";

@Bean()
export class Router {
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

  public registerHandler(
    method: HttpMethod,
    path: string,
    // biome-ignore lint/suspicious/noExplicitAny: suppress type errors
    handler: (request: any, response: any) => void,
  ) {
    if (this._mapping.has(path))
      this._mapping.set(path, [...this._mapping.get(path), [method, handler]]);
    else this._mapping.set(path, [[method, handler]]);
  }

  public handler(request: GenericHttpRequest, response: unknown) {
    const [_, handler] = this._mapping
      .get(request.path)
      .find(([method, handler]) => method === request.method.toUpperCase());
    handler(request, response);
  }
}
