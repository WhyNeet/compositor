import { Bean } from "@compositor/core";
import { HttpRouteResolver } from "../../../abstracts";
import { HttpConfiguration } from "../../../decorators";
import { HttpConfigurationHolder, Routing } from "../../configuration";
import { DefaultRouteResolver } from "./default-route-resolver";
import { SimplifiedRouteResolver } from "./simplified-route-resolver";

@Bean()
export class RouteResolverHolder {
  private _resolver: HttpRouteResolver;

  constructor(
    @HttpConfiguration() private httpConfiguration: HttpConfigurationHolder,
  ) {
    switch (httpConfiguration.routing) {
      case Routing.Default:
        this._resolver = new DefaultRouteResolver();
        break;
      case Routing.Simplified:
        this._resolver = new SimplifiedRouteResolver();
        break;
      default:
        throw new Error(
          `${this.httpConfiguration.routing} routing is not implemented.`,
        );
    }
  }

  public resolver() {
    return this._resolver;
  }
}
