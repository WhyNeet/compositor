import { Configuration, ConfigurationContext } from "@compositor/core";
import {
  HttpServerConfiguration,
  PlatformConfiguration,
} from "../../abstracts";
import { TOKEN } from "../../constants";
import { HandlerRegistrationAspect } from "../handler";
import {
  AdditionalRequestMapper,
  RouteOptimizer,
  RouteTransformer,
  Router,
} from "../router";
import { RouteResolverHolder } from "../router/resolvers";
import { HttpStarter } from "../startup";
import { HttpConfigurationHolder, Routing } from "./http-configuration";

export class HttpConfiguration extends Configuration {
  constructor(
    public platform: PlatformConfiguration,
    public serverConfiguration: HttpServerConfiguration | null,
    public routingConfiguration: Routing,
    // biome-ignore lint/suspicious/noExplicitAny:
    public mappers: { new (...args: any[]): AdditionalRequestMapper }[] | null,
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
          mappers: this.mappers,
        }),
      })
      .register({ bean: HandlerRegistrationAspect })
      .register({ bean: HttpStarter })
      .register({ bean: RouteResolverHolder })
      .register({ bean: RouteTransformer })
      .register({ bean: RouteOptimizer });
  }
}

export class HttpConfigurationBuilder {
  private _platform: { new (): PlatformConfiguration };
  private _serverConfiguration: { new (): HttpServerConfiguration };
  private _routing: Routing;
  // biome-ignore lint/suspicious/noExplicitAny:
  private _mappers: { new (...args: any[]): AdditionalRequestMapper }[];

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

  public mappers(mappers: typeof this._mappers) {
    this._mappers = mappers;
    return this;
  }

  public build() {
    const platform = this._platform;
    const serverConfiguration = this._serverConfiguration;
    const routing = this._routing;
    const mappers = this._mappers;

    return class extends HttpConfiguration {
      constructor() {
        super(
          new platform(),
          serverConfiguration ? new serverConfiguration() : null,
          routing,
          mappers ?? null,
        );
      }
    };
  }
}
