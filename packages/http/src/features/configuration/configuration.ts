import { Configuration, ConfigurationContext } from "@compositor/core";
import {
  HttpServerConfiguration,
  PlatformConfiguration,
} from "../../abstracts";
import { TOKEN } from "../../constants";
import { HandlerRegistrationAspect } from "../handler";
import { Router } from "../router";
import { RouteResolverHolder } from "../router/resolvers";
import { HttpStarter } from "../startup";
import { HttpConfigurationHolder, Routing } from "./http-configuration";

export class HttpConfiguration extends Configuration {
  constructor(
    public platform: PlatformConfiguration,
    public serverConfiguration: HttpServerConfiguration | null,
    public routingConfiguration: Routing,
  ) {
    super();
  }

  public static builder() {
    return new HttpConfigurationBuilder();
  }

  configure(cx: ConfigurationContext): void {
    cx.register({ token: TOKEN.SERVER, bean: this.platform.serverClass() })
      .register({
        token: TOKEN.REQUEST_MAPPER,
        bean: this.platform.mappers().request(),
      })
      .register({
        token: TOKEN.RESPONSE_MAPPER,
        bean: this.platform.mappers().response(),
      })
      .register({ token: TOKEN.ROUTER, bean: Router })
      .register({
        token: TOKEN.CONFIGURATION,
        bean: HttpConfigurationHolder.with({
          server: this.serverConfiguration,
          routing: this.routingConfiguration,
        }),
      })
      .register({ bean: HandlerRegistrationAspect })
      .register({ bean: HttpStarter })
      .register({ bean: RouteResolverHolder });
  }
}

export class HttpConfigurationBuilder {
  private _platform: { new (): PlatformConfiguration };
  private _serverConfiguration: { new (): HttpServerConfiguration };
  private _routing: Routing;

  public platform(platform: { new (): PlatformConfiguration }) {
    this._platform = platform;
    return this;
  }

  public serverOptions(conf: { new (): HttpServerConfiguration }) {
    this._serverConfiguration = conf;
    return this;
  }

  public routing(routing: Routing) {
    this._routing = routing;
    return this;
  }

  public build() {
    const platform = this._platform;
    const serverConfiguration = this._serverConfiguration;
    const routing = this._routing;

    return class extends HttpConfiguration {
      constructor() {
        super(
          new platform(),
          serverConfiguration ? new serverConfiguration() : null,
          routing,
        );
      }
    };
  }
}
