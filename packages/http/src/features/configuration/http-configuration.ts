import { Bean } from "@compositor/core";
import { HttpServerConfiguration } from "../../abstracts";

export class HttpConfigurationHolder {
  public server: HttpServerConfiguration | null;

  public static with(configs: { server: HttpServerConfiguration | null }) {
    const ctor = class extends HttpConfigurationHolder {
      constructor() {
        super();
        this.server = configs.server;
      }
    };

    return Bean()(ctor);
  }
}
