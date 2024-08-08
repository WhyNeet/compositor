import { Configuration, ConfigurationContext } from "@compositor/core";
import { METADATA_KEY } from "../constants";
import { ServerBean } from "../server";

export class ServerConfiguration extends Configuration {
  configure(cx: ConfigurationContext): void {
    cx.registerCtor(METADATA_KEY.SERVER, ServerBean);
  }
}
