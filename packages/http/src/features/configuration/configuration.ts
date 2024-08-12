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
    public platform: PlatformConfiguration,
    public serverConfiguration: HttpServerConfiguration | null,
  ) {
    super();
  }

  public static builder() {
    return new HttpConfigurationBuilder();
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

export class HttpConfigurationBuilder {
  private _platform: { new (): PlatformConfiguration };
  private _serverConfiguration: { new (): HttpServerConfiguration };

  public platform(platform: { new (): PlatformConfiguration }) {
    this._platform = platform;
    return this;
  }

  public serverOptions(conf: { new (): HttpServerConfiguration }) {
    this._serverConfiguration = conf;
    return this;
  }

  public build() {
    const platform = this._platform;
    const serverConfiguration = this._serverConfiguration;

    return class extends HttpConfiguration {
      constructor() {
        super(
          new platform(),
          serverConfiguration ? new serverConfiguration() : null,
        );
      }
    };
  }
}
