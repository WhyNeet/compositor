import { Configuration, ConfigurationContext } from "@compositor/core";
import { PlatformConfiguration } from "../../abstracts";
import { TOKEN } from "../../constants";
import { HandlerRegistrationAspect } from "../handler";
import { Router } from "../router";
import { HttpStarter } from "../startup";

export class HttpConfiguration extends Configuration {
  public static with(platform: { new (): PlatformConfiguration }) {
    return class extends HttpConfiguration {
      constructor() {
        super(new platform());
      }
    };
  }

  constructor(public platform: PlatformConfiguration) {
    super();
  }

  configure(cx: ConfigurationContext): void {
    cx.registerCtor(TOKEN.SERVER, this.platform.serverClass());
    cx.registerCtor(TOKEN.REQUEST_MAPPER, this.platform.mappers().request());
    cx.registerCtor(TOKEN.RESPONSE_MAPPER, this.platform.mappers().response());
    cx.registerCtor(TOKEN.ROUTER, Router);
    cx.registerCtor(HandlerRegistrationAspect);
    cx.registerCtor(HttpStarter);
  }
}
