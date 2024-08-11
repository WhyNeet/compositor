import { Ctor } from "@compositor/core";
import { HttpMapper } from "./http-mapper";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export abstract class PlatformConfiguration {
  abstract serverClass(): Ctor;
  abstract mappers(): PlatformMappersConfiguration;
}

export abstract class PlatformMappersConfiguration {
  abstract request<Request extends HttpRequest>(): {
    // biome-ignore lint/suspicious/noExplicitAny:
    new (...args: any[]): HttpMapper<unknown, HttpRequest>;
  };
  abstract response<Response extends HttpResponse>(): {
    // biome-ignore lint/suspicious/noExplicitAny:
    new (...args: any[]): HttpMapper<unknown, HttpResponse>;
  };
}
