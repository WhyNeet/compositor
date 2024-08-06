import { Configuration, ConfigurationContext } from "@compositor/core";
import { Server } from "../server";

export class ServerConfiguration extends Configuration {
  configure(cx: ConfigurationContext): void {
    cx.registerCtor(Server);
  }
}
