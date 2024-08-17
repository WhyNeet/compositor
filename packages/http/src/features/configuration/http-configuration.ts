import { Bean } from "@compositor/core";
import { HttpServerConfiguration } from "../../abstracts";

export enum Routing {
  Default = "Default",
  Simplified = "Simplified",
  Native = "Native",
}

export class HttpConfigurationHolder {
  public server: HttpServerConfiguration | null;
  public routing: Routing;

  public static with(configs: {
    server: HttpServerConfiguration | null;
    routing: Routing | null;
  }) {
    const ctor = class extends HttpConfigurationHolder {
      constructor() {
        super();
        this.server = configs.server;
        this.routing = configs.routing ?? Routing.Default;
      }
    };

    return Bean()(ctor);
  }
}
