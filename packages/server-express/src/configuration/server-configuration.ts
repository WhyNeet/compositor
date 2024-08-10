import { Configuration, ConfigurationContext } from "@compositor/core";
import { HandlerRegistrationAspect } from "../aspect";
import { METADATA_KEY } from "../constants";
import { ResponseMapper, ServerBean } from "../server";
import { RequestMapper } from "../server/request-mapper";

export class ServerConfiguration extends Configuration {
  configure(cx: ConfigurationContext): void {
    cx.registerCtor(METADATA_KEY.SERVER, ServerBean);
    cx.registerCtor(HandlerRegistrationAspect);
    cx.registerCtor(RequestMapper);
    cx.registerCtor(ResponseMapper);
  }
}
