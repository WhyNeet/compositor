import { Configuration, ConfigurationContext } from "@compositor/core";
import { ServerConfiguration } from "./server-configuration";

export class RootConfiguration extends Configuration {
  configure(cx: ConfigurationContext): void {
    cx.configure(ServerConfiguration);
  }
}
