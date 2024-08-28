import { Bean } from "@compositor/core";
import { HttpServerConfiguration } from "../../abstracts";
import { AdditionalRequestMapper } from "../router";

export enum Routing {
  Default = "Default",
  Simplified = "Simplified",
  Native = "Native",
}

export class HttpConfigurationHolder {
  public server: HttpServerConfiguration | null;
  public routing: Routing;
  // biome-ignore lint/suspicious/noExplicitAny:
  public mappers: { new (...args: any[]): AdditionalRequestMapper }[];

  public static with(configs: {
    server: HttpServerConfiguration | null;
    routing: Routing | null;
    // biome-ignore lint/suspicious/noExplicitAny:
    mappers: { new (...args: any[]): AdditionalRequestMapper }[] | null;
  }) {
    const ctor = class extends HttpConfigurationHolder {
      constructor() {
        super();
        this.server = configs.server;
        this.routing = configs.routing ?? Routing.Default;
        this.mappers = configs.mappers ?? [];
      }
    };

    return Bean()(ctor);
  }
}
