import { Configuration, ConfigurationContext } from "@compositor/core";
import {
  HttpServerConfiguration,
  PlatformConfiguration,
} from "../../abstracts";
import { TOKEN } from "../../constants";
import { HandlerRegistrationAspect } from "../handler";
import { Router } from "../router";
import { HttpStarter } from "../startup";
import { HttpConfigurationHolder } from "./http-configuration";

export class HttpConfiguration extends Configuration {
  constructor(
    private platform: PlatformConfiguration,
    private serverConfiguration: HttpServerConfiguration | null,
  ) {
    super();
  }

  configure(cx: ConfigurationContext): void {
    cx.registerCtor(TOKEN.SERVER, this.platform.serverClass());
    cx.registerCtor(TOKEN.REQUEST_MAPPER, this.platform.mappers().request());
    cx.registerCtor(TOKEN.RESPONSE_MAPPER, this.platform.mappers().response());
    cx.registerCtor(TOKEN.ROUTER, Router);
    cx.registerCtor(
      TOKEN.CONFIGURATION,
      HttpConfigurationHolder.with({ server: this.serverConfiguration }),
    );
    cx.registerCtor(HandlerRegistrationAspect);
    cx.registerCtor(HttpStarter);
  }
}
