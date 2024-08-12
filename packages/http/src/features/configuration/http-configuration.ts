import { Bean } from "@compositor/core";
import { HttpServerConfiguration } from "../../abstracts";

@Bean()
export class HttpConfigurationHolder {
  constructor(public server: HttpServerConfiguration | null) {}

  public static with(configs: { server: HttpServerConfiguration | null }) {
    return class extends HttpConfigurationHolder {
      constructor() {
        super(configs.server);
      }
    };
  }
}
